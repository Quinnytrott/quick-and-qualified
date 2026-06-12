import "server-only";

const LEAD_INTAKE_SECRET_HEADER = "x-measureagent-intake-secret";
const LEAD_INTAKE_KEY_HEADER = "x-measureagent-intake-key";
const REQUEST_TIMEOUT_MS = 8000;

type MeasureAgentLeadPayload = {
  customerName?: string;
  phone?: string;
  email?: string;
  projectType?: string;
  serviceInterest?: string;
  sourceDetail?: string;
  notes?: string;
  urgency?: string;
  formattedAddress?: string;
  streetNumber?: string;
  streetName?: string;
  streetAddress?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  placeId?: string;
  latitude?: number;
  longitude?: number;
  addressSource?: string;
  address?: string;
};

export type Q2MeasureAgentLead = {
  leadId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  formattedAddress?: string;
  streetNumber?: string;
  streetName?: string;
  streetAddress?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  placeId?: string;
  latitude?: number | null;
  longitude?: number | null;
  addressSource?: string;
  jobType: string;
  notes: string;
  source: string;
  sourceDetail?: string;
  intent: string;
};

export type MeasureAgentForwardResult =
  | {
      status: "success";
      leadId: string | null;
      followUps: string[];
      error: null;
      statusCode: number;
    }
  | {
      status: "failed";
      leadId: null;
      followUps: [];
      error: string;
      statusCode: number | null;
    }
  | {
      status: "skipped";
      leadId: null;
      followUps: [];
      error: string;
      statusCode: null;
    };

function normalize(value: string | undefined): string {
  return value?.replace(/\s+/g, " ").trim() || "";
}

function getConfiguredIntake() {
  const url = normalize(process.env.MEASUREAGENT_LEAD_INTAKE_URL);
  const secret = process.env.MEASUREAGENT_LEAD_INTAKE_SECRET?.trim() || "";
  const tenantKey = process.env.MEASUREAGENT_LEAD_INTAKE_KEY?.trim() || "";
  const missing = [
    !url ? "MEASUREAGENT_LEAD_INTAKE_URL" : "",
    !secret ? "MEASUREAGENT_LEAD_INTAKE_SECRET" : "",
    !tenantKey ? "MEASUREAGENT_LEAD_INTAKE_KEY" : "",
  ].filter(Boolean);

  if (missing.length > 0) {
    return { ok: false as const, missing };
  }

  return { ok: true as const, url, secret, tenantKey };
}

function buildStreetAddress(lead: Q2MeasureAgentLead): string {
  return normalize(lead.streetAddress) ||
    [normalize(lead.streetNumber), normalize(lead.streetName)]
      .filter(Boolean)
      .join(" ");
}

function buildProjectType(jobType: string): string {
  const normalized = jobType.toLowerCase();

  if (normalized.includes("eavestrough") || normalized.includes("fascia") || normalized.includes("roof-edge")) {
    return "eavestrough";
  }

  return "roof";
}

function buildNotes(lead: Q2MeasureAgentLead): string {
  return [
    `Q2 lead ID: ${lead.leadId}`,
    lead.intent ? `Q2 intent: ${lead.intent}` : "",
    lead.source ? `Q2 source: ${lead.source}` : "",
    lead.sourceDetail ? `Q2 source detail: ${lead.sourceDetail}` : "",
    lead.notes ? `Customer notes: ${lead.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildMeasureAgentLeadPayload(lead: Q2MeasureAgentLead): MeasureAgentLeadPayload {
  const formattedAddress = normalize(lead.formattedAddress);
  const freeformAddress = normalize(lead.address);
  const streetNumber = normalize(lead.streetNumber);
  const streetName = normalize(lead.streetName);
  const streetAddress = buildStreetAddress(lead);
  const city = normalize(lead.city);
  const province = normalize(lead.province);
  const postalCode = normalize(lead.postalCode);
  const placeId = normalize(lead.placeId);
  const addressSource = normalize(lead.addressSource);
  const latitude = typeof lead.latitude === "number" ? lead.latitude : null;
  const longitude = typeof lead.longitude === "number" ? lead.longitude : null;

  return {
    customerName: normalize(lead.name),
    phone: normalize(lead.phone),
    email: normalize(lead.email),
    projectType: buildProjectType(lead.jobType),
    serviceInterest: normalize(lead.jobType),
    ...(lead.sourceDetail ? { sourceDetail: normalize(lead.sourceDetail) } : {}),
    notes: buildNotes(lead),
    ...(formattedAddress ? { formattedAddress } : {}),
    ...(streetNumber ? { streetNumber } : {}),
    ...(streetName ? { streetName } : {}),
    ...(streetAddress ? { streetAddress } : {}),
    ...(city ? { city } : {}),
    ...(province ? { province } : {}),
    ...(postalCode ? { postalCode } : {}),
    ...(placeId ? { placeId } : {}),
    ...(latitude !== null ? { latitude } : {}),
    ...(longitude !== null ? { longitude } : {}),
    ...(addressSource ? { addressSource } : {}),
    ...(formattedAddress || freeformAddress ? { address: formattedAddress || freeformAddress } : {}),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

async function readErrorSummary(response: Response): Promise<string> {
  if (response.headers.get("content-type")?.includes("application/json")) {
    const body = (await response.json().catch(() => null)) as unknown;

    if (isRecord(body)) {
      return asString(body.error) || asString(body.message) || `MeasureAgent intake returned ${response.status}.`;
    }
  }

  return `MeasureAgent intake returned ${response.status}.`;
}

function toSafeErrorMessage(error: unknown): string {
  if (error instanceof Error && error.name === "AbortError") {
    return "MeasureAgent intake request timed out.";
  }

  return error instanceof Error && error.message
    ? error.message
    : "MeasureAgent intake request failed.";
}

export async function forwardLeadToMeasureAgent(lead: Q2MeasureAgentLead): Promise<MeasureAgentForwardResult> {
  const config = getConfiguredIntake();
  if (!config.ok) {
    return {
      status: "skipped",
      leadId: null,
      followUps: [],
      error: `Missing MeasureAgent intake env: ${config.missing.join(", ")}.`,
      statusCode: null,
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [LEAD_INTAKE_SECRET_HEADER]: config.secret,
        [LEAD_INTAKE_KEY_HEADER]: config.tenantKey,
      },
      body: JSON.stringify(buildMeasureAgentLeadPayload(lead)),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        status: "failed",
        leadId: null,
        followUps: [],
        error: await readErrorSummary(response),
        statusCode: response.status,
      };
    }

    const body = (await response.json().catch(() => null)) as unknown;
    const responseBody = isRecord(body) ? body : {};

    return {
      status: "success",
      leadId: asString(responseBody.leadId),
      followUps: asStringArray(responseBody.followUps),
      error: null,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      status: "failed",
      leadId: null,
      followUps: [],
      error: toSafeErrorMessage(error),
      statusCode: null,
    };
  } finally {
    clearTimeout(timeout);
  }
}
