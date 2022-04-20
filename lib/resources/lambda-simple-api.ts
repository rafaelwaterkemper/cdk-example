import { Stack } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";

export function getLambdaSimpleApi(stack: Stack) {
  return new Function(stack, "simple-api", {
    runtime: Runtime.NODEJS_14_X,
    handler: "index.handler",
    code: Code.fromAsset(
      join(__dirname, "..", "..", "src", "lambdas", "simple-api")
    ),
  });
}
