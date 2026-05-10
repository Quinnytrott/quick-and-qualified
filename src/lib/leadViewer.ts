import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

const DEFAULT_SITE_URL = "https://www.quickandqualified.ca";

function getLeadViewerSecret(): string {
  const secret = process.env.LEAD_VIEWER_SECRET;

  if (!secret) {
    throw new Error("Missing LEAD_VIEWER_SECRET.");
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
