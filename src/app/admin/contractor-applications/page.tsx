import { Timestamp } from "firebase-admin/firestore";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/firebaseAdmin";
import {
  createLeadViewerToken,
  verifyContractorApplicationsAdminToken,
} from "@/lib/leadViewer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContractorApplicationSummary = {
  id: string;
  companyName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  serviceAreas?: string;
  servicesOffered?: string;
  status?: string;
  notificationStatus?: string;
  createdAt?: Timestamp | Date | string | null;
};

type ContractorApplicationsPageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

function formatDate(value: ContractorApplicationSummary["createdAt"]): string {
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

function formatStatus(value: string | undefined): string {
  return value?.trim() || "new";
}

export default async function ContractorApplicationsPage(props: ContractorApplicationsPageProps) {
  const searchParams = await props.searchParams;
  const token = Array.isArray(searchParams.token)
    ? searchParams.token[0]
    : searchParams.token;

  if (!verifyContractorApplicationsAdminToken(token)) {
    notFound();
  }

  const applicationsSnapshot = await getDb()
    .collection("contractorApplications")
    .orderBy("createdAt", "desc")
    .limit(100)
    .get();
  const applications = applicationsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<ContractorApplicationSummary, "id">),
  }));

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-zinc-600">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
            Contractor Applications
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Review and vet contractors before homeowner information is handed off.
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
          {applications.length > 0 ? (
            <div className="divide-y divide-zinc-200">
              {applications.map((application) => {
                const detailToken = createLeadViewerToken(application.id);
                const detailHref =
                  `/admin/contractor-applications/${application.id}?token=${detailToken}`;

                return (
                  <article
                    className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_180px]"
                    key={application.id}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-semibold text-zinc-900">
                          {application.companyName || "Unnamed company"}
                        </h2>
                        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium capitalize text-zinc-700">
                          {formatStatus(application.status)}
                        </span>
                      </div>
                      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                            Contact
                          </dt>
                          <dd className="mt-1 text-zinc-900">{application.contactName || "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                            Phone
                          </dt>
                          <dd className="mt-1 text-zinc-900">{application.phone || "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                            Email
                          </dt>
                          <dd className="mt-1 break-all text-zinc-900">{application.email || "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                            Service Areas
                          </dt>
                          <dd className="mt-1 text-zinc-900">{application.serviceAreas || "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                            Services
                          </dt>
                          <dd className="mt-1 text-zinc-900">{application.servicesOffered || "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                            Created
                          </dt>
                          <dd className="mt-1 text-zinc-900">{formatDate(application.createdAt)}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                            Notification
                          </dt>
                          <dd className="mt-1 text-zinc-900">{application.notificationStatus || "—"}</dd>
                        </div>
                      </dl>
                    </div>
                    <div className="flex items-start lg:justify-end">
                      <Link
                        className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
                        href={detailHref}
                      >
                        View Application
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="p-6 text-sm text-zinc-600">No contractor applications yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}
