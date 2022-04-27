import { Stack } from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import {getResourceName} from "../cdk-example-stack";

export function createAPIGateway(stack: Stack, lambdaFunction: NodejsFunction) {
  const apiGateway = new LambdaRestApi(stack, getResourceName("api-gateway-cdk-example"), {
    handler: lambdaFunction,
    proxy: false,
    deployOptions: {
      stageName: process.env.NAMESPACE || "dev",
    },
  });

  const info = apiGateway.root.addResource("info");
  info.addMethod("GET");
}
