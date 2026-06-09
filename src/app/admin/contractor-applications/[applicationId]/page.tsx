import { Timestamp } from "firebase-admin/firestore";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ContractorApplicationActions } from "@/components/ContractorApplicationActions";
import { getDb } from "@/lib/firebaseAdmin";
import { verifyLeadViewerToken } from "@/lib/leadViewer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const APPLICATION_STATUSES = ["new", "reviewing", "approved", "rejected", "paused"] as const;

type ContractorApplicationStatus = (typeof APPLICATION_STATUSES)[number];

type ContractorApplicationDocument = {
  companyName?: string;
  contactName?: string;
  name?: string;
  phone?: string;
  email?: string;
  website?: string;
  serviceAreas?: string;
  servicesOffered?: string;
  minimumJobSize?: string;
  insuranceStatus?: string;
  wsibStatus?: string;
  safetyStatus?: string;
  preferredLeadTypes?: string;
  referralFeeOpen?: string;
  notes?: string;
  status?: string;
  internalNotes?: string;
  createdAt?: Timestamp | Date | string | null;
  reviewedAt?: Timestamp | Date | string | null;
  notificationStatus?: string;
};

type ContractorApplicationPageProps = {
  params: Promise<{
    applicationId: string;
  }>;
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

function formatDate(value: ContractorApplicationDocument["createdAt"]): string {
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

function toApplicationStatus(value: string | undefined): ContractorApplicationStatus {
  return APPLICATION_STATUSES.includes(value as ContractorApplicationStatus)
    ? (value as ContractorApplicationStatus)
    : "new";
}

function toWebsiteHref(value: string | undefined): string | null {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(candidate);

    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function toTelHref(phone: string | undefined): string | null {
  const sanitized = phone?.replace(/[^\d+]/g, "");

  return sanitized ? `tel:${sanitized}` : null;
}

function toMailtoHref(email: string | undefined): string | null {
  const trimmed = email?.trim();

  return trimmed ? `mailto:${trimmed}` : null;
}

function DetailItem(props: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const { label, children, className = "" } = props;

  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-7 text-zinc-900">
        {children || "—"}
      </dd>
    </div>
  );
}

export default async function ContractorApplicationDetailPage(
  props: ContractorApplicationPageProps,
) {
  const { applicationId } = await props.params;
  const searchParams = await props.searchParams;
  const token = Array.isArray(searchParams.token)
    ? searchParams.token[0]
    : searchParams.token;

  if (!token || !verifyLeadViewerToken(applicationId, token)) {
    notFound();
  }

  const applicationSnapshot = await getDb()
    .collection("contractorApplications")
    .doc(applicationId)
    .get();

  if (!applicationSnapshot.exists) {
    notFound();
  }

  const application = applicationSnapshot.data() as ContractorApplicationDocument;
  const status = toApplicationStatus(application.status);
  const websiteHref = toWebsiteHref(application.website);
  const telHref = toTelHref(application.phone);
  const mailtoHref = toMailtoHref(application.email);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-zinc-600">Contractor Application</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              {application.companyName || "Unnamed company"}
            </h1>
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium capitalize text-zinc-700">
              {status}
            </span>
          </div>
          <p className="mt-3 text-sm text-zinc-600">
            Application reference: <span className="font-medium text-zinc-900">{applicationId}</span>
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]">
          <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-zinc-900">Application Details</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {telHref ? (
                <a
                  className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
                  href={telHref}
                >
                  Call
                </a>
              ) : null}
              {mailtoHref ? (
                <a
                  className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
                  href={mailtoHref}
                >
                  Email
                </a>
              ) : null}
              {websiteHref ? (
                <a
                  className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
                  href={websiteHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  Website / Social
                </a>
              ) : null}
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <DetailItem label="Company Name">{application.companyName}</DetailItem>
              <DetailItem label="Contact Name">{application.contactName || application.name}</DetailItem>
              <DetailItem label="Phone">{application.phone}</DetailItem>
              <DetailItem label="Email">{application.email}</DetailItem>
              <DetailItem className="sm:col-span-2" label="Website / Social">
                {application.website}
              </DetailItem>
              <DetailItem className="sm:col-span-2" label="Service Areas">
                {application.serviceAreas}
              </DetailItem>
              <DetailItem className="sm:col-span-2" label="Services Offered">
                {application.servicesOffered}
              </DetailItem>
              <DetailItem label="Minimum Job Size">{application.minimumJobSize}</DetailItem>
              <DetailItem label="Insurance Status">{application.insuranceStatus}</DetailItem>
              <DetailItem label="WSIB Status">{application.wsibStatus}</DetailItem>
              <DetailItem label="Working at Heights / Safety">{application.safetyStatus}</DetailItem>
              <DetailItem className="sm:col-span-2" label="Preferred Lead Types">
                {application.preferredLeadTypes}
              </DetailItem>
              <DetailItem label="Referral / Qualification Fee">
                {application.referralFeeOpen}
              </DetailItem>
              <DetailItem label="Created At">{formatDate(application.createdAt)}</DetailItem>
              <DetailItem label="Reviewed At">{formatDate(application.reviewedAt)}</DetailItem>
              <DetailItem label="Notification Status">{application.notificationStatus}</DetailItem>
              <DetailItem className="sm:col-span-2" label="Notes">
                {application.notes}
              </DetailItem>
            </dl>
          </article>

          <aside className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">Vetting</h2>
            <div className="mt-5">
              <ContractorApplicationActions
                applicationId={applicationId}
                initialInternalNotes={application.internalNotes || ""}
                initialStatus={status}
                viewerToken={token}
              />
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
