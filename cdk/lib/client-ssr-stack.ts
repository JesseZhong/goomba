// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import * as cdk from '@aws-cdk/core';
import { CfnParameter, Duration } from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as lambda from '@aws-cdk/aws-lambda';
import * as route53 from '@aws-cdk/aws-route53';
import * as acm from '@aws-cdk/aws-certificatemanager';
import { CloudFrontAllowedMethods, ViewerProtocolPolicy } from '@aws-cdk/aws-cloudfront';

export class SsrStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    const domain = process.env.SITE_URL;
    if (!domain) {
      throw new Error('Site URL undefined.');
    }

    const siteBucketName = new CfnParameter(this, domain, {
      type: 'String',
      description: 'Name of the site bucket.'
    });

    // Create a bucket to store the static version of the site.
    const siteBucket = new s3.Bucket(
      this,
      'ssr-site', {
        bucketName: siteBucketName.valueAsString,
        websiteIndexDocument: 'index.html',
        websiteErrorDocument: 'error.html',
        publicReadAccess: false
      }
    );
    new cdk.CfnOutput(
      this,
      'Bucket',
      { value: siteBucket.bucketName }
    );

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
        destinationBucket: siteBucket
      }
    );

    // Configure the Lambda@Edge function for
    // serving SSR versions of the client/site.
    const ssrEdgeFunction = new lambda.Function(
      this,
        'ssrEdgeHandler', {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromAsset('../client/ssr-build'),
        memorySize: 128,
        timeout: Duration.seconds(5),
        handler: 'index.handler'
      }
    );

    // Declare a function version tracker for the SSR function.
    const ssrEdgeFunctionVersion = new lambda.Version(
      this,
      'ssrEdgeHandlerVersion',
      { lambda: ssrEdgeFunction }
    );

    // Lookup an existing hosted zone for the specified domain.
    const hostedZone = route53.HostedZone.fromLookup(
      this,
      'hosted-zone',
      {
        domainName: domain
      }
    );

    // Create a certificate (and validate) if one doesn't exist.
    const certificate = new acm.Certificate(
      this,
      'certificate',
      {
        domainName: domain,
        validation: acm.CertificateValidation.fromDns(hostedZone)
      }
    );

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
            aliases: [
              domain
            ]
          }
        ),

        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
              originAccessIdentity: originAccessIdentity
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                allowedMethods: CloudFrontAllowedMethods.GET_HEAD,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                lambdaFunctionAssociations: [
                  {
                    eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
                    lambdaFunction: ssrEdgeFunctionVersion
                  }
                ]
              }
            ]
          },
          {
            customOriginSource: {
              domainName: domain,
              originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
              allowedOriginSSLVersions: [
                cloudfront.OriginSslPolicy.SSL_V3,
                cloudfront.OriginSslPolicy.TLS_V1_2
              ]
            },
            behaviors: [
              {
                allowedMethods: CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                lambdaFunctionAssociations: [
                  {
                    eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
                    lambdaFunction: ssrEdgeFunctionVersion
                  }
                ]
              }
            ]
          }
        ]
      }
    );

    new cdk.CfnOutput(this, 'SSR Site', {
      value: `https://${distribution.distributionDomainName}`
    });
  }
}