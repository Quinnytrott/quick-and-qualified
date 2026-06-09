import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { Resend, type WebhookEventPayload } from "resend";
import { getDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

type LeadWebhookStatus = "sent" | "delivery_delayed" | "delivered" | "failed";

type TrackedWebhookEvent = Extract<
  WebhookEventPayload,
  {
    type:
      | "email.sent"
      | "email.delivered"
      | "email.delivery_delayed"
      | "email.failed"
      | "email.bounced"
      | "email.suppressed";
  }
>;

type LeadNotificationDocument = {
  notificationLastEventAt?: string | null;
};

const NOTIFICATION_COLLECTIONS = ["leads", "contractorApplications"] as const;

function getWebhookSecret(): string {
  const secret = process.env.RESEND_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error("Missing RESEND_WEBHOOK_SECRET.");
  }

  return secret;
}

function getSvixHeaders(request: Request) {
  const id = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signature = request.headers.get("svix-signature");

  if (!id || !timestamp || !signature) {
    return null;
  }

  return { id, timestamp, signature };
}

function isTrackedWebhookEvent(event: WebhookEventPayload): event is TrackedWebhookEvent {
  return [
    "email.sent",
    "email.delivered",
    "email.delivery_delayed",
    "email.failed",
    "email.bounced",
    "email.suppressed",
  ].includes(event.type);
}

function toEventTimestamp(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : timestamp;
}

function buildNotificationUpdate(event: TrackedWebhookEvent) {
  const baseUpdate = {
    notificationLastEventAt: event.created_at,
    notificationLastEventType: event.type,
    notificationWebhookReceivedAt: FieldValue.serverTimestamp(),
  };

  switch (event.type) {
    case "email.sent":
      return {
        ...baseUpdate,
        notificationStatus: "sent" as LeadWebhookStatus,
        notificationError: null,
      };
    case "email.delivered":
      return {
        ...baseUpdate,
        notificationStatus: "delivered" as LeadWebhookStatus,
        notificationDeliveredAt: event.created_at,
        notificationError: null,
      };
    case "email.delivery_delayed":
      return {
        ...baseUpdate,
        notificationStatus: "delivery_delayed" as LeadWebhookStatus,
        notificationDelayedAt: event.created_at,
        notificationError: "Delivery delayed by recipient mail server.",
      };
    case "email.failed":
      return {
        ...baseUpdate,
        notificationStatus: "failed" as LeadWebhookStatus,
        notificationFailedAt: event.created_at,
        notificationError: event.data.failed.reason || "Email delivery failed.",
      };
    case "email.bounced":
      return {
        ...baseUpdate,
        notificationStatus: "failed" as LeadWebhookStatus,
        notificationFailedAt: event.created_at,
        notificationError: event.data.bounce.message || "Email bounced.",
      };
    case "email.suppressed":
      return {
        ...baseUpdate,
        notificationStatus: "failed" as LeadWebhookStatus,
        notificationFailedAt: event.created_at,
        notificationError: event.data.suppressed.message || "Email suppressed.",
      };
  }
}

async function findNotificationDocument(emailId: string) {
  const db = getDb();

  for (const collectionName of NOTIFICATION_COLLECTIONS) {
    const snapshot = await db
      .collection(collectionName)
      .where("notificationEmailId", "==", emailId)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      return {
        collectionName,
        doc: snapshot.docs[0],
      };
    }
  }

  return null;
}

export async function POST(request: Request) {
  let webhookSecret: string;
  try {
    webhookSecret = getWebhookSecret();
  } catch (error) {
    console.error("Missing Resend webhook secret", error);
    return NextResponse.json(
      { success: false, message: "Webhook secret is not configured." },
      { status: 500 },
    );
  }

  const headers = getSvixHeaders(request);

  if (!headers) {
    return NextResponse.json(
      { success: false, message: "Missing webhook signature headers." },
      { status: 400 },
    );
  }

  let payload: string;
  try {
    payload = await request.text();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid webhook payload." },
      { status: 400 },
    );
  }

  let event: WebhookEventPayload;
  try {
    event = new Resend().webhooks.verify({
      payload,
      headers,
      webhookSecret,
    });
  } catch (error) {
    console.error("Invalid Resend webhook", error);
    return NextResponse.json(
      { success: false, message: "Invalid webhook signature." },
      { status: 400 },
    );
  }

  if (!isTrackedWebhookEvent(event)) {
    return NextResponse.json({
      success: true,
      ignored: true,
      type: event.type,
    });
  }

  const db = getDb();
  const notificationDocument = await findNotificationDocument(event.data.email_id);

  if (!notificationDocument) {
    return NextResponse.json({
      success: true,
      ignored: true,
      reason: "submission_not_found",
      emailId: event.data.email_id,
      type: event.type,
    });
  }

  const leadDoc = notificationDocument.doc;
  const update = buildNotificationUpdate(event);

  const updateResult = await db.runTransaction(async (transaction) => {
    const currentSnapshot = await transaction.get(leadDoc.ref);
    const currentLead = currentSnapshot.data() as LeadNotificationDocument | undefined;
    const currentTimestamp = toEventTimestamp(currentLead?.notificationLastEventAt);
    const incomingTimestamp = toEventTimestamp(event.created_at);

    if (
      currentTimestamp !== null &&
      incomingTimestamp !== null &&
      incomingTimestamp < currentTimestamp
    ) {
      return "stale";
    }

    transaction.update(leadDoc.ref, update);
    return "updated";
  });

  return NextResponse.json({
    success: true,
    leadId: leadDoc.id,
    collectionName: notificationDocument.collectionName,
    emailId: event.data.email_id,
    type: event.type,
    result: updateResult,
  });
}
