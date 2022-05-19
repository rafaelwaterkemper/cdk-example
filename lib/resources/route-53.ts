import { Stack } from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import {
  ARecord,
  HostedZone,
  IHostedZone,
  RecordTarget,
} from "aws-cdk-lib/aws-route53";
import { ApiGateway } from "aws-cdk-lib/aws-route53-targets";
import { getResourceName } from "../utils";

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
  restApi: RestApi
): NetworkSchema {
  const apiDomain = getAPIDomain();

  const apiARecord = new ARecord(stack, getResourceName("rest-api-arecord"), {
    recordName: apiDomain,
    target: RecordTarget.fromAlias(new ApiGateway(restApi)),
    zone: hostedZone,
  });

  console.info("RestAPI: ", apiDomain);

  return {
    hostedZone,
    apiARecord,
  };
}
