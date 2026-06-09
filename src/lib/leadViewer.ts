import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

const DEFAULT_SITE_URL = "https://www.quickandqualified.ca";

function getLeadViewerSecret(): string {
  const secret = process.env.LEAD_VIEWER_SECRET;

  if (!secret) {
    throw new Error(
      "Missing LEAD_VIEWER_SECRET. Add it to the Vercel Preview and Production environments so admin lead/application links can be signed and verified.",
    );
  }

  return secret;
}

function signLeadId(leadId: string): string {
  return createHmac("sha256", getLeadViewerSecret())
    .update(leadId)
    .digest("base64url");
}

export function verifyLeadViewerToken(leadId: string, token: string): boolean {
  const expectedSignature = signLeadId(leadId);
  const receivedBuffer = Buffer.from(token, "utf8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(receivedBuffer, expectedBuffer);
}

export function createLeadViewerToken(leadId: string): string {
  return signLeadId(leadId);
}

export function getSiteUrl(): string {
  const siteUrl =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : DEFAULT_SITE_URL);

  return siteUrl.replace(/\/$/, "");
}

export function buildLeadViewerUrl(leadId: string): string {
  return buildLeadViewerUrlWithToken(leadId, createLeadViewerToken(leadId));
}

export function buildLeadViewerUrlWithToken(leadId: string, token: string): string {
  const url = new URL(`/admin/leads/${leadId}`, getSiteUrl());
  url.searchParams.set("token", token);
  return url.toString();
}

export function buildContractorApplicationViewerUrl(applicationId: string): string {
  return buildContractorApplicationViewerUrlWithToken(
    applicationId,
    createLeadViewerToken(applicationId),
  );
}

export function buildContractorApplicationViewerUrlWithToken(
  applicationId: string,
  token: string,
): string {
  const url = new URL(`/admin/contractor-applications/${applicationId}`, getSiteUrl());
  url.searchParams.set("token", token);
  return url.toString();
}

export function getContractorApplicationsAdminToken(): string {
  const token = process.env.CONTRACTOR_APPLICATIONS_ADMIN_TOKEN?.trim();

  if (!token) {
    throw new Error(
      "Missing CONTRACTOR_APPLICATIONS_ADMIN_TOKEN. Add it to the Vercel Preview and Production environments to access the contractor applications list.",
    );
  }

  return token;
}

export function verifyContractorApplicationsAdminToken(token: string | undefined): boolean {
  const expectedToken = getContractorApplicationsAdminToken();

  if (!token) {
    return false;
  }

  const expectedBuffer = Buffer.from(expectedToken, "utf8");
  const receivedBuffer = Buffer.from(token, "utf8");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function buildLeadAttachmentUrl(
  leadId: string,
  attachmentIndex: number,
  token: string,
): string {
  const url = new URL(`/api/lead/${leadId}/attachments/${attachmentIndex}`, getSiteUrl());
  url.searchParams.set("token", token);
  return url.toString();
}
