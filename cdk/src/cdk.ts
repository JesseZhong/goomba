import { App } from 'aws-cdk-lib';
import { SsrStack } from './client-ssr-stack';

const app = new App();

new SsrStack(app, 'SSRAppStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1', // Enforce for Lambda@Edge
  },
});
