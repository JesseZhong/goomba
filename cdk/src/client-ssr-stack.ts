import { Construct } from 'constructs';
import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import {
  CloudFrontAllowedMethods,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';

export class SsrStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const domain = process.env.SITE_URL;
    if (!domain) {
      throw new Error('Site URL undefined.');
    }

    // Create a bucket to store the static version of the site.
    const siteBucket = new s3.Bucket(this, 'ssr-site', {
      bucketName: domain,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: false,
    });
    new CfnOutput(this, 'Bucket', { value: siteBucket.bucketName });

    // User OAI to restrict access to CloudFront distribution.
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      'ssr-oai'
    );
    siteBucket.grantRead(originAccessIdentity);

    // Deploy the site to the bucket.
    new s3deploy.BucketDeployment(
      this,
      'Compiled static site/client to be served through S3.',
      {
        sources: [s3deploy.Source.asset('../client/build/')],
        destinationBucket: siteBucket,
      }
    );

    // Configure the Lambda@Edge function for
    // serving SSR versions of the client/site.
    const ssrEdgeFunction = new lambda.Function(this, 'ssr-lambda-edge', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromAsset('../client/ssr-build'),
      memorySize: 128,
      timeout: Duration.seconds(5),
      handler: 'index.handler',
      description: `Generated on: ${new Date().toISOString()}`,
    });

    // Declare a function aliasing for targeting latest SSR function.
    const ssrEdgeFunctionAlias = new lambda.Alias(
      this,
      'ssr-lambda-edge-alias',
      {
        aliasName: 'live',
        version: ssrEdgeFunction.currentVersion,
      }
    );

    // Lookup an existing hosted zone for the specified domain.
    const hostedZone = route53.HostedZone.fromLookup(this, 'hosted-zone', {
      domainName: domain.replace(
        /^(.*\.|)(?<domain>[^\/]*\..{2,5})$/i,
        '$<domain>'
      ),
    });

    // Create a certificate (and validate) if one doesn't exist.
    const certificate = new acm.Certificate(this, 'certificate', {
      domainName: domain,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'site-cdn',
      {
        // Max allowed HTTP.
        httpVersion: cloudfront.HttpVersion.HTTP2,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,

        // Cheapest. Only serving USA, Canada, Europe, & Israel.
        priceClass: cloudfront.PriceClass.PRICE_CLASS_100,

        // Setup custom domain along with certificate.
        // Also, enforce 1.2 minimum.
        viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
          certificate,
          {
            securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
            aliases: [domain],
          }
        ),

        originConfigs: [
          {
            // Make site bucket the origin,
            // allowing access via OAI.
            s3OriginSource: {
              s3BucketSource: siteBucket,
              originAccessIdentity: originAccessIdentity,
            },

            behaviors: [
              {
                isDefaultBehavior: true,
                allowedMethods: CloudFrontAllowedMethods.GET_HEAD,

                // Enforce HTTPS.
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,

                // Make sure to forward User-Agent for
                // Lambda@Edge to distinguish between user and bot.
                forwardedValues: {
                  headers: ['User-Agent'],
                  queryString: false,
                },

                // Trigger Lambda@Edge on all origin requests.
                // It will inspect whether the request is from a bot
                // or user, and serve an SSR version of the client/site
                // if the request is from a bot.
                lambdaFunctionAssociations: [
                  {
                    eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
                    lambdaFunction: ssrEdgeFunctionAlias.version,
                  },
                ],
              },
            ],
          },
        ],

        // Forward non-root routes to client to handle, instead
        // of being rejected by S3 as a non-existent object path.
        errorConfigurations: [
          {
            errorCode: 403,
            responsePagePath: '/index.html',
            responseCode: 200,
            errorCachingMinTtl: 300,
          },
          {
            errorCode: 404,
            responsePagePath: '/index.html',
            responseCode: 200,
            errorCachingMinTtl: 300,
          },
        ],
      }
    );

    new CfnOutput(this, 'CloudFront URL', {
      value: `https://${distribution.distributionDomainName}`,
    });
  }
}
