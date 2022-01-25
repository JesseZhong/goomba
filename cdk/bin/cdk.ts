#!/usr/bin/env node

import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SsrStack } from '../lib/client-ssr-stack';

const app = new cdk.App();

new SsrStack(
    app,
    'SSRAppStack',
    {
        env: {
            account: process.env.CDK_DEFAULT_ACCOUNT, 
            region: 'us-east-1' // Enforce for Lambda@Edge
        }
    }
);