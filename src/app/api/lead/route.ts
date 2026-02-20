import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";
import { getDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
const LEAD_NOTIFICATION_TO =
  process.env.NOTIFICATION_EMAIL || "quinnytrott@gmail.com";

const LEAD_NOTIFICATION_FROM =
  process.env.LEAD_NOTIFICATION_FROM ||
  "Q2 Leads <leads@quickandqualified.ca>";

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
  message?: string;
  notes: string;
  filePath?: string;
};

function asTrimmedString(value: unknown): string {
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

async function sendLeadNotification(params: {
  lead: LeadPayload;
  createdAtIso: string;
  leadId: string;
  filePath: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY.");
  }

  const { lead, createdAtIso, leadId, filePath } = params;
  const resend = new Resend(apiKey);
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const firestoreLink = projectId
    ? `https://console.firebase.google.com/project/${projectId}/firestore/data/~2Fleads~2F${leadId}`
    : null;

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
      <tr><td><strong>File Path</strong></td><td>${escapeHtml(filePath || "—")}</td></tr>
      <tr><td><strong>Created At</strong></td><td>${escapeHtml(createdAtIso)}</td></tr>
    </table>
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

  let body: Partial<LeadPayload>;

  try {
    body = (await request.json()) as Partial<LeadPayload>;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const lead: LeadPayload = {
    name: asTrimmedString(body.name),
    email: asTrimmedString(body.email),
    phone: asTrimmedString(body.phone),
    address: asTrimmedString(body.address),
    jobType: asTrimmedString(body.jobType),
    notes: asTrimmedString(body.notes) || asTrimmedString(body.message),
    filePath: asTrimmedString(body.filePath),
  };

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

  let docRef: { id: string };
  try {
    docRef = await db.collection("leads").add({
      ...lead,
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
      filePath: lead.filePath ?? "",
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
