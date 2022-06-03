import { CfnOutput, Duration, RemovalPolicy } from "aws-cdk-lib";
import { ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import {
  CloudFrontAllowedMethods,
  CloudFrontWebDistribution,
  HttpVersion,
  OriginAccessIdentity,
  PriceClass,
  SecurityPolicyProtocol,
  ViewerCertificate,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { AnyPrincipal, PolicyStatement } from "aws-cdk-lib/aws-iam";
import {
  BlockPublicAccess,
  Bucket,
  BucketAccessControl,
} from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { getAPIDomain, getAPPDomain, getNamespace, getResourceName } from "../utils";

export interface WebappResourcesSchema {
  bucket: Bucket;
  cloudFrontDistribution: CloudFrontWebDistribution;
}

export function getWebappResources(
  stack: Construct,
  certificate: ICertificate
): WebappResourcesSchema {
  const bucket = new Bucket(stack, getResourceName("webapp-bucket"), {
    bucketName: getAPPDomain(),
    websiteIndexDocument: "index.html",
    websiteErrorDocument: "index.html",
    blockPublicAccess: new BlockPublicAccess({
      restrictPublicBuckets: false,
    }),
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });

  const logBucket = new Bucket(stack, getResourceName("log-bucket"), {
    bucketName: getResourceName("log-bucket"),
    blockPublicAccess: {
      blockPublicAcls: true,
      blockPublicPolicy: true,
      restrictPublicBuckets: true,
      ignorePublicAcls: true,
    },
    lifecycleRules: [
      {
        enabled: true,
        expiration: Duration.days(60),
      },
    ],
    accessControl: BucketAccessControl.LOG_DELIVERY_WRITE,
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });

  new BucketDeployment(stack, getResourceName("webapp-bucket-deployment"), {
    sources: [Source.asset(`${__dirname}/../../public`)],
    destinationBucket: bucket,
    destinationKeyPrefix: `/`,
  });

  bucket.addToResourcePolicy(
    new PolicyStatement({
      actions: ["s3:GetObject"],
      resources: [`${bucket.bucketArn}/*`],
      principals: [new AnyPrincipal()],
    })
  );

  const originAccessIdentity = new OriginAccessIdentity(
    stack,
    getResourceName("origin-access-identity"),
    {
      comment: `CloudFront OAI for ${getNamespace()}`,
    }
  );

  const cloudFrontDistribution = new CloudFrontWebDistribution(
    stack,
    getResourceName("cloud-front-web-distribution"),
    {
      httpVersion: HttpVersion.HTTP2,
      comment: getResourceName("cloud-front-web-distribution"),
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              compress: true,
              allowedMethods: CloudFrontAllowedMethods.GET_HEAD,
              forwardedValues: {
                cookies: {
                  forward: "none",
                },
                queryString: true,
                headers: [
                  "Access-Control-Request-Headers",
                  "Access-Control-Request-Method",
                  "Origin",
                ],
              },
            },
          ],
        },
      ],
      loggingConfig: {
        bucket: logBucket,
        includeCookies: false,
      },
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      priceClass: PriceClass.PRICE_CLASS_100,
      viewerCertificate: ViewerCertificate.fromAcmCertificate(certificate, {
        aliases: [getAPIDomain(), getAPPDomain()],
        securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2021,
      }),
      defaultRootObject: "index.html",
      errorConfigurations: [
        {
          errorCachingMinTtl: 0,
          errorCode: 403,
          responseCode: 200,
          responsePagePath: "/index.html",
        },
      ],
    }
  );

  return { bucket, cloudFrontDistribution };
}
