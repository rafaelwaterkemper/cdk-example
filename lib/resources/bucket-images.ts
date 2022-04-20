import { Bucket, BucketAccessControl, HttpMethods } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export function getBucketImage(stack: Construct) {
  return new Bucket(stack, "bucket-images", {
    accessControl: BucketAccessControl.PRIVATE,
    cors: [
      {
        allowedOrigins: ["*"],
        allowedMethods: [HttpMethods.GET],
      },
    ],
    bucketName: "images-cdk-example" + process.env.NAMESPACE,
  });
}
