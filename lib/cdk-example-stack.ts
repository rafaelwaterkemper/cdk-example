import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { DefaultStackSynthesizer, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { getBucketImage } from "./resources/bucket-images";
import { getLambdaSimpleApi } from "./resources/lambda-simple-api";
import { createAPIGateway } from "./resources/api-gateway-get-plates";
import { getEventBridgeCron } from "./resources/event-bridge-cron";
import { capitalize, getNamespace } from "./utils";

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

new CdkExampleStack(app, `CdkExampleStack${capitalize(getNamespace())}`, {
  synthesizer: new DefaultStackSynthesizer({
    qualifier: "NEW_QUALI",
  }),
});
