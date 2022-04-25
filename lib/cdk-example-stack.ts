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
