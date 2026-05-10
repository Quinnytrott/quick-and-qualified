import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import {
  buildMeasureAgentProjectUrl,
  getMeasureAgentCompanyId,
  getMeasureAgentDb,
  getMeasureAgentOwnerUid,
} from "@/lib/measureAgentBridge";
import { buildLeadAttachmentUrl, buildLeadViewerUrlWithToken, verifyLeadViewerToken } from "@/lib/leadViewer";

export const runtime = "nodejs";

type LeadAttachment = {
  name?: string;
  path?: string;
  url?: string;
  contentType?: string;
  size?: number;
};

type LeadDocument = {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  jobType?: string;
  notes?: string;
  attachments?: LeadAttachment[];
  measureAgentProjectId?: string;
  measureAgentProjectUrl?: string;
  conversionStatus?: string;
};

type RouteContext = {
  params: Promise<{
    leadId: string;
  }>;
};

type ConvertRequestBody = {
  token?: string;
};

type MeasureAgentSupportingPhoto = {
  id: string;
  storagePath: string;
  downloadURL?: string;
  title: string;
  description: string;
  category: "inspection" | "damage" | "feature" | "other";
  order: number;
  uploadedAt?: string;
  originalFileName?: string;
};

function buildProjectId(leadId: string): string {
  return `q2-${leadId}`;
}

function trimOrNull(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function buildProjectTitle(lead: LeadDocument, leadId: string): string {
  return trimOrNull(lead.address) || trimOrNull(lead.name) || `Q2 Lead ${leadId}`;
}

function buildContactPhone(lead: LeadDocument): string | null {
  return trimOrNull(lead.phone);
}

function buildScopes(jobType: string | undefined) {
  const normalized = jobType?.trim().toLowerCase() || "";

  if (normalized.includes("eavestrough")) {
    return { roof: false, eavestrough: true, siding: false, soffitFascia: false };
  }

  if (normalized.includes("soffit") || normalized.includes("fascia")) {
    return { roof: false, eavestrough: false, siding: false, soffitFascia: true };
  }

  if (normalized.includes("siding")) {
    return { roof: false, eavestrough: false, siding: true, soffitFascia: false };
  }

  return { roof: true, eavestrough: false, siding: false, soffitFascia: false };
}

function buildPrimaryScope(jobType: string | undefined): string {
  const scopes = buildScopes(jobType);

  if (scopes.eavestrough) return "eavestrough";
  if (scopes.siding) return "siding";
  if (scopes.soffitFascia) return "soffitFascia";
  return "roof";
}

function buildSupportingPhotos(
  leadId: string,
  token: string,
  attachments: LeadAttachment[],
  jobType: string | undefined,
): MeasureAgentSupportingPhoto[] {
  const category = buildPrimaryScope(jobType) === "roof" ? "inspection" : "feature";

  return attachments.flatMap((attachment, attachmentIndex) => {
    if (!attachment.path) {
      return [];
    }

    const order = attachmentIndex;

    return [
      {
        id: `q2-${leadId}-photo-${attachmentIndex + 1}`,
        storagePath: attachment.path,
        downloadURL: buildLeadAttachmentUrl(leadId, attachmentIndex, token),
        title: trimOrNull(attachment.name) || `Lead Photo ${attachmentIndex + 1}`,
        description: trimOrNull(jobType) || "Imported from Quick & Qualified lead intake.",
        category,
        order,
        uploadedAt: new Date().toISOString(),
        originalFileName: trimOrNull(attachment.name) || undefined,
      },
    ];
  });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { leadId } = await context.params;
  const body = (await request.json().catch(() => null)) as ConvertRequestBody | null;
  const token = body?.token?.trim();

  if (!token || !verifyLeadViewerToken(leadId, token)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
  }

  const q2LeadRef = getDb().collection("leads").doc(leadId);
  const leadSnapshot = await q2LeadRef.get();

  if (!leadSnapshot.exists) {
    return NextResponse.json({ success: false, message: "Lead not found." }, { status: 404 });
  }

  const lead = leadSnapshot.data() as LeadDocument;
  const existingProjectId = trimOrNull(lead.measureAgentProjectId);
  const existingProjectUrl = trimOrNull(lead.measureAgentProjectUrl);

  if (existingProjectId || existingProjectUrl) {
    const projectId = existingProjectId || buildProjectId(leadId);
    const projectUrl = existingProjectUrl || buildMeasureAgentProjectUrl(projectId);

    return NextResponse.json({
      success: true,
      projectId,
      projectUrl,
      conversionStatus: lead.conversionStatus || "converted",
      existed: true,
    });
  }

  const projectId = buildProjectId(leadId);
  const viewerUrl = buildLeadViewerUrlWithToken(leadId, token);
  const attachments = Array.isArray(lead.attachments) ? lead.attachments : [];
  const supportingPhotos = buildSupportingPhotos(leadId, token, attachments, lead.jobType);
  const firstPhotoUrl = supportingPhotos[0]?.downloadURL || null;
  const projectTitle = buildProjectTitle(lead, leadId);
  const customerName = trimOrNull(lead.name);
  const propertyAddress = trimOrNull(lead.address);
  const customerEmail = trimOrNull(lead.email);
  const contactPhone = buildContactPhone(lead);
  const now = FieldValue.serverTimestamp();
  const nowIso = new Date().toISOString();

  try {
    const ownerUid = getMeasureAgentOwnerUid();
    const companyId = getMeasureAgentCompanyId();
    const measureAgentDb = getMeasureAgentDb();
    const projectUrl = buildMeasureAgentProjectUrl(projectId);
    const projectRef = measureAgentDb.collection("users").doc(ownerUid).collection("projects").doc(projectId);
    const mirrorRef = measureAgentDb.collection("projects").doc(projectId);
    const projectSnapshot = await projectRef.get();

    if (!projectSnapshot.exists) {
      const batch = measureAgentDb.batch();

      batch.set(
        projectRef,
        {
          userId: ownerUid,
          companyId,
          kind: "stub",
          status: "draft",
          createdFrom: "web",
          captureType: "mobile",
          title: projectTitle,
          name: projectTitle,
          address: propertyAddress ? { line1: propertyAddress } : null,
          customerName,
          propertyAddress,
          contactInfo: contactPhone,
          phone: contactPhone,
          customerEmail,
          email: customerEmail,
          scopes: buildScopes(lead.jobType),
          scope: buildPrimaryScope(lead.jobType),
          workflowLane: "field_intake",
          readinessState: "lead_intake",
          source: "q2_lead",
          createdFromSystem: "q2",
          originalLeadId: leadId,
          leadViewerUrl: viewerUrl,
          leadJobType: trimOrNull(lead.jobType),
          leadNotes: trimOrNull(lead.notes),
          supportingPhotos,
          detailPhotos: supportingPhotos.map((photo) => ({
            id: photo.id,
            storagePath: photo.storagePath,
            url: photo.downloadURL || "",
            createdAt: nowIso,
            title: photo.title,
            description: photo.description,
            category: photo.category,
            order: photo.order,
          })),
          image: firstPhotoUrl,
          thumbnail: firstPhotoUrl,
          q2Lead: {
            leadId,
            viewerUrl,
            source: "q2_lead",
            jobType: trimOrNull(lead.jobType),
            notes: trimOrNull(lead.notes),
            attachments: supportingPhotos.map((photo) => ({
              id: photo.id,
              title: photo.title,
              storagePath: photo.storagePath,
              downloadURL: photo.downloadURL || null,
              originalFileName: photo.originalFileName || null,
            })),
          },
          createdAt: now,
          updatedAt: now,
        },
        { merge: false },
      );

      batch.set(
        mirrorRef,
        {
          companyId,
          ownerUid,
          title: projectTitle,
          kind: "stub",
          status: "draft",
          createdFrom: "web",
          sourcePath: `users/${ownerUid}/projects/${projectId}`,
          source: "q2_lead",
          originalLeadId: leadId,
          customerName,
          propertyAddress,
          createdAt: now,
          updatedAt: now,
        },
        { merge: true },
      );

      await batch.commit();
    }

    await q2LeadRef.set(
      {
        measureAgentProjectId: projectId,
        measureAgentProjectUrl: projectUrl,
        convertedAt: FieldValue.serverTimestamp(),
        conversionStatus: "converted",
      },
      { merge: true },
    );

    return NextResponse.json({
      success: true,
      projectId,
      projectUrl,
      conversionStatus: "converted",
      existed: projectSnapshot.exists,
    });
  } catch (error) {
    console.error("Failed to convert lead to MeasureAgent project", error);

    await q2LeadRef.set(
      {
        conversionStatus: "failed",
        conversionError:
          error instanceof Error ? error.message : "Failed to convert lead to MeasureAgent project.",
      },
      { merge: true },
    );

    return NextResponse.json(
      {
        success: false,
        message: "Could not convert the lead to a MeasureAgent project.",
      },
      { status: 500 },
    );
  }
}
