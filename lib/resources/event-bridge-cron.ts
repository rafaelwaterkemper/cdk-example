import { Stack } from "aws-cdk-lib";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { Code, Function, IFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import {getResourceName} from "../cdk-example-stack";

export function getEventBridgeCron(stack: Stack) {
  const wordGenerator = new Function(stack, getResourceName("medium-project"), {
    runtime: Runtime.NODEJS_14_X,
    handler: "index.handler",
    code: Code.fromAsset(
      join(__dirname, "..", "..", "src", "lambdas", "medium-project")
    ),
  });

  return new Rule(stack, "schedule-word-generator", {
    schedule: Schedule.cron({}),
    targets: [new LambdaFunction(wordGenerator)],
  });
}
