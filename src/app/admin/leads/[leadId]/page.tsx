import { Timestamp } from "firebase-admin/firestore";
import { notFound } from "next/navigation";
import { LeadActions } from "@/components/LeadActions";
import { getDb, getStorageBucket } from "@/lib/firebaseAdmin";
import { buildLeadViewerUrlWithToken, verifyLeadViewerToken } from "@/lib/leadViewer";

/* eslint-disable @next/next/no-img-element */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  createdAt?: Timestamp | Date | string | null;
  attachments?: LeadAttachment[];
  conversionStatus?: string;
  convertedAt?: Timestamp | Date | string | null;
  measureAgentProjectId?: string;
  measureAgentProjectUrl?: string;
};

type LeadPageProps = {
  params: Promise<{
    leadId: string;
  }>;
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

function formatCreatedAt(value: LeadDocument["createdAt"]): string {
  if (!value) {
    return "Unavailable";
  }

  const date =
    value instanceof Timestamp
      ? value.toDate()
      : value instanceof Date
        ? value
        : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Toronto",
  }).format(date);
}

async function getPhotoUrl(attachment: LeadAttachment): Promise<string | null> {
  try {
    if (attachment.path) {
      const [url] = await getStorageBucket().file(attachment.path).getSignedUrl({
        action: "read",
        expires: Date.now() + 24 * 60 * 60 * 1000,
      });

      return url;
    }
  } catch (error) {
    console.error("Failed to create photo URL for lead attachment", error);
  }

  return attachment.url || null;
}

export default async function LeadDetailPage(props: LeadPageProps) {
  const { leadId } = await props.params;
  const searchParams = await props.searchParams;
  const token = Array.isArray(searchParams.token)
    ? searchParams.token[0]
    : searchParams.token;

  if (!token || !verifyLeadViewerToken(leadId, token)) {
    notFound();
  }

  const leadSnapshot = await getDb().collection("leads").doc(leadId).get();

  if (!leadSnapshot.exists) {
    notFound();
  }

  const lead = leadSnapshot.data() as LeadDocument;
  const attachments = Array.isArray(lead.attachments) ? lead.attachments : [];
  const viewerUrl = buildLeadViewerUrlWithToken(leadId, token);
  const photos = await Promise.all(
    attachments.map(async (attachment, index) => ({
      name: attachment.name || `Photo ${index + 1}`,
      url: await getPhotoUrl(attachment),
    })),
  );

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-zinc-600">Lead Viewer</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
            {lead.name || "Unnamed lead"}
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Lead reference: <span className="font-medium text-zinc-900">{leadId}</span>
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]">
          <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-zinc-900">Lead Details</h2>
            <LeadActions
              address={lead.address || ""}
              customerName={lead.name || ""}
              email={lead.email || ""}
              initialConversionStatus={lead.conversionStatus || ""}
              initialMeasureAgentProjectId={lead.measureAgentProjectId || ""}
              initialMeasureAgentProjectUrl={lead.measureAgentProjectUrl || ""}
              jobType={lead.jobType || ""}
              leadId={leadId}
              notes={lead.notes || ""}
              phone={lead.phone || ""}
              viewerToken={token}
              viewerUrl={viewerUrl}
            />
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">Phone</dt>
                <dd className="mt-1 text-sm text-zinc-900">{lead.phone || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">Email</dt>
                <dd className="mt-1 break-all text-sm text-zinc-900">{lead.email || "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">Address</dt>
                <dd className="mt-1 text-sm text-zinc-900">{lead.address || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">Job Type</dt>
                <dd className="mt-1 text-sm text-zinc-900">{lead.jobType || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">Created At</dt>
                <dd className="mt-1 text-sm text-zinc-900">{formatCreatedAt(lead.createdAt)}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">Notes</dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm leading-7 text-zinc-900">
                  {lead.notes || "—"}
                </dd>
              </div>
            </dl>
          </article>

          <aside className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">Photos</h2>
            <p className="mt-2 text-sm text-zinc-600">
              {photos.length > 0
                ? `${photos.length} uploaded with this lead.`
                : "No photos were uploaded with this lead."}
            </p>
          </aside>
        </section>

        {photos.length > 0 ? (
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {photos.map((photo) => (
                <figure
                  key={`${leadId}-${photo.name}`}
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50"
                >
                  {photo.url ? (
                    <img
                      alt={photo.name}
                      className="h-64 w-full bg-zinc-100 object-cover"
                      loading="lazy"
                      src={photo.url}
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-zinc-100 px-6 text-center text-sm text-zinc-500">
                      Photo preview unavailable.
                    </div>
                  )}
                  <figcaption className="border-t border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700">
                    {photo.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
