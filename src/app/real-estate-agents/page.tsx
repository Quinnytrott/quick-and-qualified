import type { Metadata } from "next";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { QuoteForm } from "@/components/QuoteForm";
import { BUSINESS_NAME } from "@/lib/business";
import { primaryButtonClass } from "@/lib/ui";

export const metadata: Metadata = {
  title: `Q2 Pre-Listing Exterior Snapshot | ${BUSINESS_NAME}`,
  description:
    "Pre-listing roof and exterior snapshots for real estate agents who want visible condition documentation before listing, negotiation, or closing.",
};

const AGENT_JOB_TYPES = [
  "Pre-listing exterior snapshot",
  "Buyer concern after a showing",
  "Home inspection follow-up",
  "Roof age uncertainty",
  "Storm, wind, or tree damage concern",
  "Repair handoff before listing",
  "Other real estate exterior concern",
];

const WHAT_AGENTS_RECEIVE = [
  "Drone roof overview photos",
  "Exterior and detail photos",
  "Visible condition notes",
  "Repair or contractor handoff option",
  "Hosted report or PDF-style summary where supported by the current report workflow",
];

const WHEN_TO_USE = [
  "Pre-listing prep",
  "Buyer concerns after a showing",
  "Home inspection follow-up",
  "Roof age uncertainty",
  "Storm, wind, or tree damage concerns",
  "Repair handoff before going live",
];

const WHY_IT_HELPS = [
  "Helps sellers understand visible concerns before they become listing friction",
  "Gives agents cleaner exterior context for pricing, repair, and negotiation conversations",
  "Creates a simple documentation package that can be shared when appropriate",
  "Supports faster contractor handoff when exterior repair follow-up is needed",
];

export default function RealEstateAgentsPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header ctaHref="#book-pre-listing-snapshot" ctaLabel="Book Snapshot" />
      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
        <section className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <p className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-900">
              Q2 Pre-Listing Exterior Snapshot
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-zinc-900 md:text-5xl">
              Pre-listing exterior snapshots for real estate agents
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
              Q2 helps agents and sellers spot visible roof, eavestrough, fascia, soffit, and exterior concerns before they slow down a listing, negotiation, or closing.
            </p>
            <div className="mt-8">
              <a className={`${primaryButtonClass} inline-flex justify-center`} href="#book-pre-listing-snapshot">
                Book a Pre-Listing Exterior Snapshot
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200">
            <Image
              alt="Eavestrough and downspout on a modern home"
              className="object-cover"
              fill
              sizes="(min-width: 1280px) 32rem, (min-width: 1024px) 42vw, 100vw"
              src="/eaves-rain.jpg"
            />
          </div>
        </section>

        <section className="mt-20 grid gap-6 md:mt-24 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-medium text-zinc-600">What Agents Receive</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              Exterior documentation before surprises slow the deal.
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              The snapshot is designed to support first-look listing decisions and cleaner follow-up, not to replace a licensed home inspection, engineering review, or contractor quote.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {WHAT_AGENTS_RECEIVE.map((item) => (
              <li key={item} className="rounded-xl border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-700">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20 rounded-xl bg-blue-50 p-6 sm:p-8 md:mt-24 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-zinc-600">When To Use It</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              Useful before listing, during negotiation, or after concerns come up.
            </h2>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WHEN_TO_USE.map((item) => (
              <li key={item} className="rounded-xl border border-blue-100 bg-white p-4 text-sm leading-6 text-zinc-700">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20 space-y-6 md:mt-24">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-zinc-600">Why It Helps</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              Better exterior context for sellers and listings.
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {WHY_IT_HELPS.map((item) => (
              <article key={item} className="rounded-xl border border-zinc-200 bg-white p-6">
                <p className="text-sm leading-7 text-zinc-700">{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 pb-16 md:mt-24" id="book-pre-listing-snapshot">
          <QuoteForm
            defaultJobType="Pre-listing exterior snapshot"
            description="Share the listing address, timing, and what prompted the request. Q2 will follow up to confirm fit, access, timing, and the best next step."
            heading="Book a Pre-Listing Exterior Snapshot"
            intent="q2_pre_listing_exterior_snapshot"
            jobTypeLabel="Reason For Snapshot"
            jobTypes={AGENT_JOB_TYPES}
            source="real_estate_agents_page"
            submitLabel="Book Pre-Listing Snapshot"
            successMessage="Thanks — we received your pre-listing exterior snapshot request. Q2 will reply within 24 hours."
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
