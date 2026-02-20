import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";
import { getDb, getStorageBucket } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
const LEAD_NOTIFICATION_TO =
  process.env.NOTIFICATION_EMAIL || "quinnytrott@gmail.com";

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
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY.");
  }

  const { lead, createdAtIso, leadId, attachments } = params;
  const resend = new Resend(apiKey);
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const firestoreLink = projectId
    ? `https://console.firebase.google.com/project/${projectId}/firestore/data/~2Fleads~2F${leadId}`
    : null;

  const photosHtml =
    attachments.length > 0
      ? `<ul style="margin:8px 0 0 18px;padding:0;">${attachments
          .map(
            (attachment) =>
              `<li style="margin:0 0 6px;"><a href="${escapeHtml(attachment.url)}">${escapeHtml(attachment.name)}</a></li>`,
          )
          .join("")}</ul>`
      : `<p style="margin:8px 0 0;">—</p>`;

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
      <tr><td><strong>Created At</strong></td><td>${escapeHtml(createdAtIso)}</td></tr>
    </table>
    <h3 style="margin:16px 0 0;">Photos</h3>
    ${photosHtml}
    ${
      firestoreLink
        ? `<p style="margin:16px 0 0;"><a href="${firestoreLink}">Open in Firestore</a></p>`
        : ""
    }
  `;

  await resend.emails.send({
    from: LEAD_NOTIFICATION_FROM,
    to: LEAD_NOTIFICATION_TO,
    subject: `New Q2 Lead — ${lead.jobType} — ${lead.name}`,
    html,
  });
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
    });
  } catch (error) {
    console.error("Failed to create lead", error);
    return NextResponse.json(
      { success: false, message: "Failed to save lead." },
      { status: 500 },
    );
  }

  try {
    await sendLeadNotification({
      lead,
      createdAtIso,
      leadId: docRef.id,
      attachments,
    });
  } catch (error) {
    console.error("Failed to send lead notification email", error);
    return NextResponse.json(
      { success: false, message: "Lead saved but notification email failed." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
