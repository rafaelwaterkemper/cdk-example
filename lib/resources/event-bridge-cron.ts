import { Stack } from "aws-cdk-lib";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { Code, Function, IFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";

export function getEventBridgeCron(stack: Stack) {
  const wordGenerator = new Function(stack, "simple-api", {
    runtime: Runtime.NODEJS_14_X,
    handler: "index.handler",
    code: Code.fromAsset(
      join(__dirname, "..", "..", "src", "lambdas", "simple-api")
    ),
  });

  return new Rule(stack, "schedule-word-generator", {
    schedule: Schedule.cron({}),
    targets: [new LambdaFunction(wordGenerator)],
  });
}
