import { NextRequest, NextResponse } from "next/server";
import { getDb, getStorageBucket } from "@/lib/firebaseAdmin";
import { verifyLeadViewerToken } from "@/lib/leadViewer";

export const runtime = "nodejs";

type LeadAttachment = {
  name?: string;
  path?: string;
  url?: string;
  contentType?: string;
};

type LeadDocument = {
  attachments?: LeadAttachment[];
};

type RouteContext = {
  params: Promise<{
    leadId: string;
    attachmentIndex: string;
  }>;
};

function getFilename(attachment: LeadAttachment, attachmentIndex: number): string {
  const filename = attachment.name?.trim();
  return filename && filename.length > 0 ? filename : `lead-photo-${attachmentIndex + 1}`;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { leadId, attachmentIndex } = await context.params;
  const token = request.nextUrl.searchParams.get("token")?.trim();

  if (!token || !verifyLeadViewerToken(leadId, token)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
  }

  const index = Number.parseInt(attachmentIndex, 10);

  if (!Number.isInteger(index) || index < 0) {
    return NextResponse.json({ success: false, message: "Invalid attachment index." }, { status: 400 });
  }

  const leadSnapshot = await getDb().collection("leads").doc(leadId).get();

  if (!leadSnapshot.exists) {
    return NextResponse.json({ success: false, message: "Lead not found." }, { status: 404 });
  }

  const lead = leadSnapshot.data() as LeadDocument;
  const attachments = Array.isArray(lead.attachments) ? lead.attachments : [];
  const attachment = attachments[index];

  if (!attachment?.path) {
    return NextResponse.json({ success: false, message: "Attachment not found." }, { status: 404 });
  }

  const file = getStorageBucket().file(attachment.path);
  const [exists] = await file.exists();

  if (!exists) {
    return NextResponse.json({ success: false, message: "Attachment file not found." }, { status: 404 });
  }

  const [buffer] = await file.download();
  const filename = getFilename(attachment, index);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Cache-Control": "private, max-age=300",
      "Content-Disposition": `inline; filename="${filename.replace(/\"/g, "")}"`,
      "Content-Type": attachment.contentType || "application/octet-stream",
    },
  });
}
