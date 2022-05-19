import {
  DnsValidatedCertificate,
  ICertificate,
} from "aws-cdk-lib/aws-certificatemanager";
import { IHostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";
import { getResourceName } from "../utils";

export function getHTTPSCertificate(
  stack: Construct,
  hostedZone: IHostedZone
): ICertificate {
  const apiDomain = getAPIDomain();
  return new DnsValidatedCertificate(stack, getResourceName("certificate"), {
    domainName: apiDomain,
    hostedZone: hostedZone
  });
}
