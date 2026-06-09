import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { verifyLeadViewerToken } from "@/lib/leadViewer";

export const runtime = "nodejs";

const APPLICATION_STATUSES = ["new", "reviewing", "approved", "rejected", "paused"] as const;
const MAX_INTERNAL_NOTES_LENGTH = 5000;

type ContractorApplicationStatus = (typeof APPLICATION_STATUSES)[number];

type RouteContext = {
  params: Promise<{
    applicationId: string;
  }>;
};

type UpdateRequestBody = {
  token?: string;
  status?: string;
  internalNotes?: string;
};

function isApplicationStatus(value: string | undefined): value is ContractorApplicationStatus {
  return APPLICATION_STATUSES.includes(value as ContractorApplicationStatus);
}

function trimInternalNotes(value: string): string {
  return value.trim().slice(0, MAX_INTERNAL_NOTES_LENGTH);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { applicationId } = await context.params;
  const body = (await request.json().catch(() => null)) as UpdateRequestBody | null;
  const token = body?.token?.trim();

  if (!token || !verifyLeadViewerToken(applicationId, token)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
  }

  const hasStatus = typeof body?.status === "string";
  const hasInternalNotes = typeof body?.internalNotes === "string";

  if (!hasStatus && !hasInternalNotes) {
    return NextResponse.json(
      { success: false, message: "No update fields were provided." },
      { status: 400 },
    );
  }

  if (hasStatus && !isApplicationStatus(body?.status)) {
    return NextResponse.json(
      { success: false, message: "Invalid application status." },
      { status: 400 },
    );
  }

  const applicationRef = getDb().collection("contractorApplications").doc(applicationId);
  const applicationSnapshot = await applicationRef.get();

  if (!applicationSnapshot.exists) {
    return NextResponse.json(
      { success: false, message: "Contractor application not found." },
      { status: 404 },
    );
  }

  const update: Record<string, unknown> = {
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (hasStatus && body?.status) {
    update.status = body.status;
    update.reviewedAt = FieldValue.serverTimestamp();
    // TODO: Add reviewedBy when a real admin identity/auth pattern exists.
  }

  if (hasInternalNotes && typeof body?.internalNotes === "string") {
    update.internalNotes = trimInternalNotes(body.internalNotes);
  }

  await applicationRef.set(update, { merge: true });

  const currentApplication = applicationSnapshot.data() as {
    status?: string;
    internalNotes?: string;
  };
  const nextStatus = hasStatus && body?.status
    ? body.status
    : currentApplication.status || "new";
  const nextInternalNotes = hasInternalNotes && typeof body?.internalNotes === "string"
    ? trimInternalNotes(body.internalNotes)
    : currentApplication.internalNotes || "";

  return NextResponse.json({
    success: true,
    status: nextStatus,
    internalNotes: nextInternalNotes,
  });
}
