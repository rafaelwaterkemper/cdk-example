import { Stack } from "aws-cdk-lib";
import { Bucket, BucketAccessControl, HttpMethods } from "aws-cdk-lib/aws-s3";
import {getResourceName} from "../cdk-example-stack";

export function getBucketImage(stack: Stack) {
  return new Bucket(stack, getResourceName("bucket-images"), {
    accessControl: BucketAccessControl.PRIVATE,
    cors: [
      {
        allowedOrigins: ["*"],
        allowedMethods: [HttpMethods.GET],
      },
    ],
    bucketName: "teste-images-cdk-example-" + (process.env.NAMESPACE || "dev"),
  });
}
