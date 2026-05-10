import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";
import { getDb, getStorageBucket } from "@/lib/firebaseAdmin";
import { buildLeadViewerUrl } from "@/lib/leadViewer";

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

type LeadPayload = {
  name: string;
  email: string;
  phone: string;
  address: string;
  jobType: string;
  notes: string;
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
}): Promise<string | null> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY.");
  }

  const { lead, createdAtIso, leadId, attachments } = params;
  const resend = new Resend(apiKey);
  const photosSummary = attachments.length > 0
    ? `${attachments.length}`
    : "0";
  const leadViewerUrl = buildLeadViewerUrl(leadId);

  const html = `
    <h2 style="margin:0 0 12px;">New Q2 Lead</h2>
    <p style="margin:0 0 16px;color:#52525b;">A new quote request was submitted.</p>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
      <tr><td><strong>Name</strong></td><td>${escapeHtml(lead.name)}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${escapeHtml(lead.phone)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(lead.email)}</td></tr>
      <tr><td><strong>Address</strong></td><td>${escapeHtml(lead.address)}</td></tr>
      <tr><td><strong>Job Type</strong></td><td>${escapeHtml(lead.jobType)}</td></tr>
      <tr><td><strong>Message</strong></td><td>${escapeHtml(lead.notes || "—")}</td></tr>
      <tr><td><strong>Photos Uploaded</strong></td><td>${escapeHtml(photosSummary)}</td></tr>
      <tr><td><strong>Lead Reference</strong></td><td>${escapeHtml(leadId)}</td></tr>
      <tr><td><strong>Created At</strong></td><td>${escapeHtml(createdAtIso)}</td></tr>
    </table>
    <p style="margin:16px 0 0;color:#52525b;">Photos are stored with the lead record.</p>
    <p style="margin:20px 0 0;">
      <a
        href="${escapeHtml(leadViewerUrl)}"
        style="display:inline-block;border-radius:9999px;background:#1d4ed8;color:#ffffff;padding:12px 18px;text-decoration:none;font-weight:600;"
      >
        View Lead
      </a>
    </p>
  `;

  const text = [
    "New Q2 Lead",
    "",
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Address: ${lead.address}`,
    `Job Type: ${lead.jobType}`,
    `Message: ${lead.notes || "—"}`,
    `Photos Uploaded: ${photosSummary}`,
    `Lead Reference: ${leadId}`,
    `Created At: ${createdAtIso}`,
    "",
    "Photos are stored with the lead record.",
    `View Lead: ${leadViewerUrl}`,
  ].join("\n");

  const { data, error } = await resend.emails.send({
    from: LEAD_NOTIFICATION_FROM,
    to: LEAD_NOTIFICATION_TO,
    replyTo: lead.email,
    subject: `New Q2 Lead — ${lead.jobType} — ${lead.name}`,
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

  const lead: LeadPayload = {
    name: asTrimmedString(form.get("name")),
    email: asTrimmedString(form.get("email")),
    phone: asTrimmedString(form.get("phone")),
    address: asTrimmedString(form.get("address")),
    jobType: asTrimmedString(form.get("jobType")),
    notes: asTrimmedString(form.get("notes")) || asTrimmedString(form.get("message")),
  };

  const files = form.getAll("files");

  const missing = (
    ["name", "email", "phone", "address", "jobType"] as const
  ).filter((field) => !lead[field]);

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
  const docRef = db.collection("leads").doc();

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
    console.error("Failed to create lead", error);
    return NextResponse.json(
      { success: false, message: "Failed to save lead." },
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
    notificationStatus,
  });
}
