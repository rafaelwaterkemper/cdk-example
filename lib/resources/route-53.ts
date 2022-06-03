import { Stack } from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import {CloudFrontWebDistribution} from "aws-cdk-lib/aws-cloudfront";
import {
  ARecord,
  HostedZone,
  IHostedZone,
  RecordTarget,
} from "aws-cdk-lib/aws-route53";
import { ApiGateway, CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { getAPIDomain, getAPPDomain, getCdkConfiguration, getResourceName } from "../utils";

export interface NetworkSchema {
  hostedZone: IHostedZone;
  apiARecord: ARecord;
}

export function getHostedZone(stack: Stack): IHostedZone {
  const { zoneName, hostedZoneId } = getCdkConfiguration();
  return HostedZone.fromHostedZoneAttributes(
    stack,
    getResourceName("hosted-zone"),
    {
      zoneName,
      hostedZoneId,
    }
  );
}

export function getHostedZoneRecords(
  stack: Stack,
  hostedZone: IHostedZone,
  restApi: RestApi,
  distribution: CloudFrontWebDistribution
): NetworkSchema {
  const apiDomain = getAPIDomain();
  const appDomain = getAPPDomain();

  const apiARecord = new ARecord(stack, getResourceName("rest-api-arecord"), {
    recordName: apiDomain,
    target: RecordTarget.fromAlias(new ApiGateway(restApi)),
    zone: hostedZone,
  });

  const appARecord = new ARecord(stack, getResourceName('webapp-arecord'), {
    recordName: appDomain,
    target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    zone: hostedZone,
  });

  console.info("RestAPI: ", apiDomain);

  return {
    hostedZone,
    apiARecord
  };
}
