import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";
import { getDb, getStorageBucket } from "@/lib/firebaseAdmin";
import {
  buildContractorApplicationViewerUrl,
  buildLeadViewerUrl,
} from "@/lib/leadViewer";

export const runtime = "nodejs";
const LEAD_NOTIFICATION_TO = "info@quickandqualified.ca";

const LEAD_NOTIFICATION_FROM =
  process.env.LEAD_NOTIFICATION_FROM ||
  "Q2 Leads <leads@quickandqualified.ca>";

const SIGNED_URL_TTL_MS = 7 * 24 * 60 * 60 * 1000;

if (process.env.NODE_ENV === "development") {
  console.log("Lead email config:", {
    to: LEAD_NOTIFICATION_TO,
    from: LEAD_NOTIFICATION_FROM,
  });
}

type RequestType = "homeownerInspection" | "contractorApplication";

type LeadPayload = {
  requestType: RequestType;
  name: string;
  email: string;
  phone: string;
  address: string;
  jobType: string;
  notes: string;
  urgency?: string;
  preferredContactMethod?: string;
  consentToShare?: boolean;
  companyName?: string;
  contactName?: string;
  website?: string;
  serviceAreas?: string;
  servicesOffered?: string;
  minimumJobSize?: string;
  insuranceStatus?: string;
  wsibStatus?: string;
  safetyStatus?: string;
  preferredLeadTypes?: string;
  referralFeeOpen?: string;
};

type LeadAttachment = {
  name: string;
  path: string;
  url: string;
  contentType: string;
  size: number;
};

type LeadNotificationStatus =
  | "pending"
  | "sent"
  | "delivery_delayed"
  | "delivered"
  | "failed";

function asTrimmedString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function asRequestType(value: FormDataEntryValue | null): RequestType {
  return value === "contractorApplication" ? "contractorApplication" : "homeownerInspection";
}

function asChecked(value: FormDataEntryValue | null): boolean {
  return value === "yes" || value === "on" || value === "true";
}

function buildLeadPayload(form: FormData): LeadPayload {
  const requestType = asRequestType(form.get("requestType"));

  if (requestType === "contractorApplication") {
    const contactName = asTrimmedString(form.get("contactName"));
    const companyName = asTrimmedString(form.get("companyName"));
    const serviceAreas = asTrimmedString(form.get("serviceAreas"));
    const servicesOffered = asTrimmedString(form.get("servicesOffered"));

    return {
      requestType,
      name: contactName,
      contactName,
      companyName,
      email: asTrimmedString(form.get("email")),
      phone: asTrimmedString(form.get("phone")),
      address: serviceAreas,
      jobType: servicesOffered,
      notes: asTrimmedString(form.get("notes")) || asTrimmedString(form.get("message")),
      website: asTrimmedString(form.get("website")),
      serviceAreas,
      servicesOffered,
      minimumJobSize: asTrimmedString(form.get("minimumJobSize")),
      insuranceStatus: asTrimmedString(form.get("insuranceStatus")),
      wsibStatus: asTrimmedString(form.get("wsibStatus")),
      safetyStatus: asTrimmedString(form.get("safetyStatus")),
      preferredLeadTypes: asTrimmedString(form.get("preferredLeadTypes")),
      referralFeeOpen: asTrimmedString(form.get("referralFeeOpen")),
    };
  }

  return {
    requestType,
    name: asTrimmedString(form.get("name")),
    email: asTrimmedString(form.get("email")),
    phone: asTrimmedString(form.get("phone")),
    address: asTrimmedString(form.get("address")),
    jobType: asTrimmedString(form.get("jobType")),
    notes: asTrimmedString(form.get("notes")) || asTrimmedString(form.get("message")),
    urgency: asTrimmedString(form.get("urgency")),
    preferredContactMethod: asTrimmedString(form.get("preferredContactMethod")),
    consentToShare: asChecked(form.get("consentToShare")),
  };
}

function getMissingFields(lead: LeadPayload): string[] {
  if (lead.requestType === "contractorApplication") {
    const requiredFields: Array<[string, string | undefined]> = [
      ["companyName", lead.companyName],
      ["contactName", lead.contactName],
      ["email", lead.email],
      ["phone", lead.phone],
      ["serviceAreas", lead.serviceAreas],
      ["servicesOffered", lead.servicesOffered],
      ["insuranceStatus", lead.insuranceStatus],
      ["wsibStatus", lead.wsibStatus],
      ["safetyStatus", lead.safetyStatus],
      ["referralFeeOpen", lead.referralFeeOpen],
    ];

    return requiredFields.flatMap(([field, value]) => (value ? [] : [field]));
  }

  const requiredFields: Array<[string, string | undefined]> = [
    ["name", lead.name],
    ["email", lead.email],
    ["phone", lead.phone],
    ["address", lead.address],
    ["jobType", lead.jobType],
    ["urgency", lead.urgency],
    ["preferredContactMethod", lead.preferredContactMethod],
    ["consentToShare", lead.consentToShare ? "yes" : ""],
  ];

  return requiredFields.flatMap(([field, value]) => (value ? [] : [field]));
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error.";
}

function toSafeFilename(filename: string): string {
  const sanitized = filename
    .trim()
    .replace(/[\\/]/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "_");

  return sanitized || "upload";
}

async function uploadLeadAttachments(
  files: FormDataEntryValue[],
  leadId: string,
): Promise<LeadAttachment[]> {
  const validFiles = files.filter(
    (entry): entry is File => entry instanceof File && entry.size > 0,
  );

  if (validFiles.length === 0) {
    return [];
  }

  const bucket = getStorageBucket();
  const attachments: LeadAttachment[] = [];

  for (const file of validFiles) {
    const safeFilename = toSafeFilename(file.name);
    const path = `leads/${leadId}/${Date.now()}-${safeFilename}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || "application/octet-stream";
    const bucketFile = bucket.file(path);

    await bucketFile.save(bytes, { contentType });

    const [url] = await bucketFile.getSignedUrl({
      action: "read",
      expires: Date.now() + SIGNED_URL_TTL_MS,
    });

    attachments.push({
      name: file.name || safeFilename,
      path,
      url,
      contentType,
      size: file.size,
    });
  }

  return attachments;
}

async function sendLeadNotification(params: {
  lead: LeadPayload;
  createdAtIso: string;
  leadId: string;
  attachments: LeadAttachment[];
  collectionName: string;
}): Promise<string | null> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY.");
  }

  const { lead, createdAtIso, leadId, attachments, collectionName } = params;
  const resend = new Resend(apiKey);
  const photosSummary = attachments.length > 0 ? `${attachments.length}` : "0";
  const isContractorApplication = lead.requestType === "contractorApplication";
  const heading = isContractorApplication
    ? "New Q2 Contractor Application"
    : "New Q2 Inspection Request";
  const description = isContractorApplication
    ? "A contractor applied for the private Q2 partner network."
    : "A homeowner requested an exterior inspection or documentation package.";
  const viewerUrl = isContractorApplication
    ? buildContractorApplicationViewerUrl(leadId)
    : buildLeadViewerUrl(leadId);
  const rows = isContractorApplication
    ? [
        ["Submission Type", "Contractor application"],
        ["Company Name", lead.companyName || "-"],
        ["Contact Name", lead.contactName || lead.name],
        ["Phone", lead.phone],
        ["Email", lead.email],
        ["Website / Social", lead.website || "-"],
        ["Service Areas", lead.serviceAreas || "-"],
        ["Services Offered", lead.servicesOffered || "-"],
        ["Minimum Job Size", lead.minimumJobSize || "-"],
        ["Insurance Status", lead.insuranceStatus || "-"],
        ["WSIB Status", lead.wsibStatus || "-"],
        ["Safety Status", lead.safetyStatus || "-"],
        ["Preferred Lead Types", lead.preferredLeadTypes || "-"],
        ["Referral / Qualification Fee", lead.referralFeeOpen || "-"],
        ["Notes", lead.notes || "-"],
        ["Submission Reference", leadId],
        ["Collection", collectionName],
        ["Created At", createdAtIso],
      ]
    : [
        ["Submission Type", "Homeowner inspection request"],
        ["Name", lead.name],
        ["Phone", lead.phone],
        ["Email", lead.email],
        ["Address", lead.address],
        ["Issue Type", lead.jobType],
        ["Urgency", lead.urgency || "-"],
        ["Preferred Contact", lead.preferredContactMethod || "-"],
        ["Contractor Handoff Consent", lead.consentToShare ? "Yes" : "No"],
        ["Notes", lead.notes || "-"],
        ["Photos Uploaded", photosSummary],
        ["Lead Reference", leadId],
        ["Created At", createdAtIso],
      ];
  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const viewerButton = viewerUrl
    ? `
    <p style="margin:20px 0 0;">
      <a
        href="${escapeHtml(viewerUrl)}"
        style="display:inline-block;border-radius:9999px;background:#1d4ed8;color:#ffffff;padding:12px 18px;text-decoration:none;font-weight:600;"
      >
        ${isContractorApplication ? "View Application" : "View Lead"}
      </a>
    </p>
  `
    : "";
  const subject = isContractorApplication
    ? `New Q2 Contractor Application - ${lead.companyName || lead.name}`
    : `New Q2 Inspection Request - ${lead.jobType} - ${lead.name}`;

  const html = `
    <h2 style="margin:0 0 12px;">${escapeHtml(heading)}</h2>
    <p style="margin:0 0 16px;color:#52525b;">${escapeHtml(description)}</p>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
      ${tableRows}
    </table>
    <p style="margin:16px 0 0;color:#52525b;">${
      isContractorApplication
        ? `Submission is stored in the ${escapeHtml(collectionName)} collection.`
        : "Photos are stored with the lead record."
    }</p>
    ${viewerButton}
  `;

  const text = [
    heading,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    isContractorApplication
      ? `Submission is stored in the ${collectionName} collection.`
      : "Photos are stored with the lead record.",
    `${isContractorApplication ? "View Application" : "View Lead"}: ${viewerUrl}`,
  ].filter(Boolean).join("\n");

  const { data, error } = await resend.emails.send({
    from: LEAD_NOTIFICATION_FROM,
    to: LEAD_NOTIFICATION_TO,
    replyTo: lead.email,
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error(error.message || "Failed to send lead notification.");
  }

  return data?.id ?? null;
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "development") {
    console.log("HAS FIREBASE?", !!process.env.FIREBASE_PROJECT_ID);
    console.log("HAS RESEND?", !!process.env.RESEND_API_KEY);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid multipart form data." },
      { status: 400 },
    );
  }

  const lead = buildLeadPayload(form);
  const files = lead.requestType === "homeownerInspection" ? form.getAll("files") : [];
  const missing = getMissingFields(lead);

  if (missing.length > 0) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing required fields.",
        fields: missing,
      },
      { status: 400 },
    );
  }

  let db: ReturnType<typeof getDb>;
  try {
    db = getDb();
  } catch (error) {
    console.error("Failed to initialize Firebase Admin", error);
    return NextResponse.json(
      { success: false, message: "Firebase initialization failed." },
      { status: 500 },
    );
  }

  const createdAtIso = new Date().toISOString();
  const collectionName = lead.requestType === "contractorApplication"
    ? "contractorApplications"
    : "leads";
  const docRef = db.collection(collectionName).doc();
  const vettingDefaults = lead.requestType === "contractorApplication"
    ? {
        status: "new",
        internalNotes: "",
        reviewedAt: null,
      }
    : {};

  let attachments: LeadAttachment[] = [];
  try {
    attachments = await uploadLeadAttachments(files, docRef.id);
  } catch (error) {
    console.error("Failed to upload lead attachments", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload lead photos." },
      { status: 500 },
    );
  }

  const filePaths = attachments.map((attachment) => attachment.path);

  try {
    await docRef.set({
      ...lead,
      ...vettingDefaults,
      attachments,
      filePaths,
      createdAt: FieldValue.serverTimestamp(),
      notificationStatus: "pending" satisfies LeadNotificationStatus,
      notificationAttemptedAt: null,
      notificationSentAt: null,
      notificationError: null,
      notificationEmailId: null,
      notificationLastEventAt: null,
      notificationLastEventType: null,
      notificationDelayedAt: null,
      notificationDeliveredAt: null,
      notificationFailedAt: null,
      notificationWebhookReceivedAt: null,
    });
  } catch (error) {
    console.error("Failed to create submission", error);
    return NextResponse.json(
      { success: false, message: "Failed to save submission." },
      { status: 500 },
    );
  }

  let notificationStatus: LeadNotificationStatus = "pending";
  let notificationError: string | null = null;
  let notificationEmailId: string | null = null;

  try {
    notificationEmailId = await sendLeadNotification({
      lead,
      createdAtIso,
      leadId: docRef.id,
      attachments,
      collectionName,
    });
    notificationStatus = "sent";
  } catch (error) {
    notificationStatus = "failed";
    notificationError = toErrorMessage(error);
    console.error("Failed to send lead notification email", error);
  }

  try {
    await docRef.update({
      notificationStatus,
      notificationAttemptedAt: FieldValue.serverTimestamp(),
      notificationSentAt:
        notificationStatus === "sent" ? FieldValue.serverTimestamp() : null,
      notificationFailedAt:
        notificationStatus === "failed" ? FieldValue.serverTimestamp() : null,
      notificationError,
      notificationEmailId,
    });
  } catch (error) {
    console.error("Failed to update lead notification status", error);
  }

  return NextResponse.json({
    success: true,
    leadId: docRef.id,
    requestType: lead.requestType,
    notificationStatus,
  });
}
