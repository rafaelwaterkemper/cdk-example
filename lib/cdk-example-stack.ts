import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { getBucketImage } from "./resources/bucket-images";
import { getLambdaSimpleApi } from "./resources/lambda-simple-api";
import { createAPIGateway } from "./resources/api-gateway-get-plates";
import { getEventBridgeCron } from "./resources/event-bridge-cron";
import { capitalize, getNamespace } from "./utils";
import { getHTTPSCertificate } from "./resources/certificate-dns";
import { getHostedZone, getHostedZoneRecords } from "./resources/route-53";

export class CdkExampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    getBucketImage(this);
    getEventBridgeCron(this);
    const lambdaGetPlates = getLambdaSimpleApi(this);
    const hostedZone = getHostedZone(this);
    const certificate = getHTTPSCertificate(this, hostedZone);
    const api = createAPIGateway(this, certificate, lambdaGetPlates);
    getHostedZoneRecords(this, hostedZone, api);
  }
}

const app = new cdk.App();

if (!process.env.QUALIFIER) {
  process.env.QUALIFIER = "stage";
}

new CdkExampleStack(app, `CdkExampleStack${capitalize(getNamespace())}`, {
  synthesizer: new cdk.DefaultStackSynthesizer({
    qualifier: process.env.QUALIFIER,
  }),
});
