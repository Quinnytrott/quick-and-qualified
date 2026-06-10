import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";
import { getDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

const CONTRACTOR_APPLICATION_TO = "info@quickandqualified.ca";
const CONTRACTOR_APPLICATION_FROM =
  process.env.CONTRACTOR_APPLICATION_FROM ||
  process.env.LEAD_NOTIFICATION_FROM ||
  "Q2 Contractors <leads@quickandqualified.ca>";

type ContractorApplicationPayload = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  serviceArea: string;
  servicesOffered: string;
  insuranceStatus: string;
  yearsInBusiness: string;
  preferredJobTypes: string;
  notes: string;
};

type ContractorApplicationNotificationStatus = "pending" | "sent" | "failed";

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

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error.";
}

function toPayload(value: unknown): ContractorApplicationPayload {
  const data = value && typeof value === "object"
    ? value as Record<string, unknown>
    : {};

  return {
    companyName: asTrimmedString(data.companyName),
    contactName: asTrimmedString(data.contactName),
    email: asTrimmedString(data.email),
    phone: asTrimmedString(data.phone),
    serviceArea: asTrimmedString(data.serviceArea),
    servicesOffered: asTrimmedString(data.servicesOffered),
    insuranceStatus: asTrimmedString(data.insuranceStatus),
    yearsInBusiness: asTrimmedString(data.yearsInBusiness),
    preferredJobTypes: asTrimmedString(data.preferredJobTypes),
    notes: asTrimmedString(data.notes),
  };
}

async function sendContractorApplicationNotification(params: {
  application: ContractorApplicationPayload;
  applicationId: string;
  createdAtIso: string;
}): Promise<string | null> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY.");
  }

  const { application, applicationId, createdAtIso } = params;
  const resend = new Resend(apiKey);

  const html = `
    <h2 style="margin:0 0 12px;">Q2 Contractor Partner Application</h2>
    <p style="margin:0 0 16px;color:#52525b;">A contractor applied to join Q2’s private partner network.</p>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
      <tr><td><strong>Company</strong></td><td>${escapeHtml(application.companyName)}</td></tr>
      <tr><td><strong>Contact</strong></td><td>${escapeHtml(application.contactName)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(application.email)}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${escapeHtml(application.phone)}</td></tr>
      <tr><td><strong>Service Area</strong></td><td>${escapeHtml(application.serviceArea)}</td></tr>
      <tr><td><strong>Services Offered</strong></td><td>${escapeHtml(application.servicesOffered)}</td></tr>
      <tr><td><strong>Insurance / WSIB</strong></td><td>${escapeHtml(application.insuranceStatus)}</td></tr>
      <tr><td><strong>Years In Business</strong></td><td>${escapeHtml(application.yearsInBusiness)}</td></tr>
      <tr><td><strong>Preferred Job Types</strong></td><td>${escapeHtml(application.preferredJobTypes)}</td></tr>
      <tr><td><strong>Notes</strong></td><td>${escapeHtml(application.notes || "—")}</td></tr>
      <tr><td><strong>Application Reference</strong></td><td>${escapeHtml(applicationId)}</td></tr>
      <tr><td><strong>Created At</strong></td><td>${escapeHtml(createdAtIso)}</td></tr>
    </table>
  `;

  const text = [
    "Q2 Contractor Partner Application",
    "",
    `Company: ${application.companyName}`,
    `Contact: ${application.contactName}`,
    `Email: ${application.email}`,
    `Phone: ${application.phone}`,
    `Service Area: ${application.serviceArea}`,
    `Services Offered: ${application.servicesOffered}`,
    `Insurance / WSIB: ${application.insuranceStatus}`,
    `Years In Business: ${application.yearsInBusiness}`,
    `Preferred Job Types: ${application.preferredJobTypes}`,
    `Notes: ${application.notes || "—"}`,
    `Application Reference: ${applicationId}`,
    `Created At: ${createdAtIso}`,
  ].join("\n");

  const { data, error } = await resend.emails.send({
    from: CONTRACTOR_APPLICATION_FROM,
    to: CONTRACTOR_APPLICATION_TO,
    replyTo: application.email,
    subject: `Q2 Contractor Partner Application — ${application.companyName} — ${application.contactName}`,
    html,
    text,
  });

  if (error) {
    throw new Error(error.message || "Failed to send contractor application notification.");
  }

  return data?.id ?? null;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const application = toPayload(body);
  const missing = (
    [
      "companyName",
      "contactName",
      "email",
      "phone",
      "serviceArea",
      "servicesOffered",
      "insuranceStatus",
      "yearsInBusiness",
      "preferredJobTypes",
    ] as const
  ).filter((field) => !application[field]);

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
    console.error("Failed to initialize Firebase Admin for contractor application", error);
    return NextResponse.json(
      { success: false, message: "Firebase initialization failed." },
      { status: 500 },
    );
  }

  const createdAtIso = new Date().toISOString();
  const docRef = db.collection("contractorApplications").doc();

  try {
    await docRef.set({
      ...application,
      source: "q2_contractor_application",
      createdAt: FieldValue.serverTimestamp(),
      notificationStatus: "pending" satisfies ContractorApplicationNotificationStatus,
      notificationAttemptedAt: null,
      notificationSentAt: null,
      notificationFailedAt: null,
      notificationError: null,
      notificationEmailId: null,
    });
  } catch (error) {
    console.error("Failed to save contractor application", error);
    return NextResponse.json(
      { success: false, message: "Failed to save contractor application." },
      { status: 500 },
    );
  }

  let notificationStatus: ContractorApplicationNotificationStatus = "pending";
  let notificationError: string | null = null;
  let notificationEmailId: string | null = null;

  try {
    notificationEmailId = await sendContractorApplicationNotification({
      application,
      applicationId: docRef.id,
      createdAtIso,
    });
    notificationStatus = "sent";
  } catch (error) {
    notificationStatus = "failed";
    notificationError = toErrorMessage(error);
    console.error("Failed to send contractor application notification", error);
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
    console.error("Failed to update contractor application notification status", error);
  }

  return NextResponse.json({
    success: true,
    applicationId: docRef.id,
    notificationStatus,
  });
}
