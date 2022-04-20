import { Stack } from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export function createAPIGateway(stack: Stack, lambdaFunction: NodejsFunction) {
  const apiGateway = new LambdaRestApi(stack, "api-gateway-cdk-example", {
    handler: lambdaFunction,
    proxy: false,
    deployOptions: {
      stageName: process.env.STAGE || "dev",
    },
  });

  const info = apiGateway.root.addResource("info");
  info.addMethod("GET");
}
