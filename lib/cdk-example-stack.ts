import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { getBucketImage } from "./resources/bucket-images";
import { getLambdaSimpleApi } from "./resources/lambda-simple-api";
import { createAPIGateway } from "./resources/api-gateway-get-plates";
import { getEventBridgeCron } from "./resources/event-bridge-cron";

export class CdkExampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    getBucketImage(this);
    const lambdaGetPlates = getLambdaSimpleApi(this);
    createAPIGateway(this, lambdaGetPlates);
    getEventBridgeCron(this);
  }
}

const app = new cdk.App();

new CdkExampleStack(app, `CdkExampleStack${capitalize(getNamespace())}`, {});

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getNamespace(): string {
  return <string>process.env.NAMESPACE;
}

export function getResourceName(baseName: string): string {
  return `${baseName}-${getNamespace()}`;
}
