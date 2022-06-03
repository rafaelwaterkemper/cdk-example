import {
  DnsValidatedCertificate,
  ICertificate,
} from "aws-cdk-lib/aws-certificatemanager";
import { IHostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";
import { getAPIDomain, getAPPDomain, getResourceName } from "../utils";

export function getHTTPSCertificate(
  stack: Construct,
  hostedZone: IHostedZone
): ICertificate {
  const apiDomain = getAPIDomain();
  const appDomain = getAPPDomain();
  return new DnsValidatedCertificate(stack, getResourceName("certificate"), {
    domainName: apiDomain,
    hostedZone: hostedZone,
    subjectAlternativeNames: [appDomain],
  });
}
