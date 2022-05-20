import { Stack } from "aws-cdk-lib";
import {
  LambdaRestApi,
  RestApi,
  SecurityPolicy,
} from "aws-cdk-lib/aws-apigateway";
import { ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { getAPIDomain, getResourceName } from "../utils";

export function createAPIGateway(
  stack: Stack,
  certificate: ICertificate,
  lambdaFunction: NodejsFunction
): RestApi {
  const apiGateway = new LambdaRestApi(
    stack,
    getResourceName("api-gateway-cdk-example"),
    {
      handler: lambdaFunction,
      domainName: {
        domainName: getAPIDomain(),
        certificate,
        securityPolicy: SecurityPolicy.TLS_1_2,
      },
      proxy: false,
      deployOptions: {
        stageName: process.env.NAMESPACE || "dev",
      },
    }
  );

  const info = apiGateway.root.addResource("info");
  info.addMethod("GET");

  return apiGateway;
}
