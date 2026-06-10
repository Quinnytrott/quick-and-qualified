import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ServiceCard } from "@/components/ServiceCard";
import { Step } from "@/components/Step";
import {
  BUSINESS_NAME,
  CLARITY_SECTION_COPY,
  REPORT_INCLUDED_ITEMS,
  REPORT_NAME,
  REPORT_PAGE_PATH,
  REQUEST_QUOTE_LABEL,
  SECTION_IDS,
} from "@/lib/business";
import { primaryButtonClass, secondaryButtonClass } from "@/lib/ui";

export const metadata: Metadata = {
  title: `${REPORT_NAME} | ${BUSINESS_NAME}`,
  description:
    "Drone-supported visible roof condition documentation, photo notes, urgency guidance, and contractor-ready summaries for homeowners in Georgina and surrounding areas.",
};

const WHO_ITS_FOR = [
  "Homeowners who noticed a leak, missing shingles, loose flashing, or storm damage.",
  "Homeowners who want documentation before calling contractors.",
  "Homeowners preparing for winter, wind, hail, tree damage, or ice-damming concerns.",
  "Homeowners who want a clearer contractor conversation.",
  "Contractors who benefit from better-documented opportunities.",
];

const REPORT_STEPS = [
  {
    title: "Book",
    description: "Book a report request.",
  },
  {
    title: "Capture",
    description: "Q2 captures exterior photos and drone views where appropriate.",
  },
  {
    title: "Organize",
    description: "Q2 organizes visible concerns into a simple report.",
  },
  {
    title: "Review",
    description: "You review the report and decide the next step.",
  },
  {
    title: "Share",
    description: "With permission, Q2 can share the package with a vetted contractor partner.",
  },
];

const EXAMPLE_REPORTS = [
  {
    title: "Homeowner Example Report",
    description:
      "A homeowner-friendly report with photos, visible-condition notes, urgency guidance, and next steps.",
  },
  {
    title: "Contractor Example Package",
    description:
      "A contractor-ready version with lead context, visible scope notes, access notes, and summary details.",
  },
];

export default function RoofConditionReportPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
        <section className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-start">
          <div>
            <p className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-900">
              Roof Condition Reports
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-zinc-900 md:text-5xl">
              {REPORT_NAME}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
              Clear visual roof documentation for homeowners who want to understand visible roof concerns before calling around for quotes.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link className={`${primaryButtonClass} inline-flex justify-center`} href={`/#${SECTION_IDS.quote}`}>
                {REQUEST_QUOTE_LABEL}
              </Link>
              <Link className={`${secondaryButtonClass} inline-flex justify-center`} href={`${REPORT_PAGE_PATH}#example-report`}>
                View Example Report
              </Link>
            </div>
          </div>
          <div className="rounded-xl bg-blue-50 p-6 sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
              What it is
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-700">
              A homeowner-requested, consent-based visual documentation package using drone photos, exterior photos, visible-condition notes, measurement-supported context, urgency guidance, and optional contractor handoff.
            </p>
          </div>
        </section>

        <section className="mt-20 space-y-6 md:mt-24">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-zinc-600">What’s Included</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              What the report includes
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REPORT_INCLUDED_ITEMS.map((item) => (
              <ServiceCard key={item.title} description={item.description} title={item.title} />
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-6 md:mt-24 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-medium text-zinc-600">Who It’s For</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              Built for clearer decisions before quotes.
            </h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {WHO_ITS_FOR.map((item) => (
              <li key={item} className="rounded-xl border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-700">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20 rounded-xl bg-blue-50 p-6 sm:p-8 md:mt-24 lg:p-10">
          <div className="space-y-6">
            <p className="text-sm font-medium text-zinc-600">How It Works</p>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
              From report request to next step.
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {REPORT_STEPS.map((step, index) => (
                <Step key={step.title} description={step.description} number={index + 1} title={step.title} />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20 space-y-6 md:mt-24" id="example-report">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-zinc-600">Example Report</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              Preview an example report
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              Soon, you’ll be able to view a sample homeowner report and contractor-ready version so you can see exactly what Q2 provides before booking.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {EXAMPLE_REPORTS.map((example) => (
              <article key={example.title} className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
                <h3 className="text-xl font-semibold tracking-tight text-zinc-900">{example.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">{example.description}</p>
                <p className="mt-5 inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-900">
                  Coming soon
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-xl bg-blue-50 p-6 sm:p-8 md:mt-24 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-zinc-600">{CLARITY_SECTION_COPY.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              {CLARITY_SECTION_COPY.heading}
            </h2>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <article className="rounded-xl border border-blue-100 bg-white p-6">
              <h3 className="text-lg font-semibold text-zinc-900">What it is</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{CLARITY_SECTION_COPY.isDescription}</p>
            </article>
            <article className="rounded-xl border border-blue-100 bg-white p-6">
              <h3 className="text-lg font-semibold text-zinc-900">What it isn’t</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{CLARITY_SECTION_COPY.isNotDescription}</p>
            </article>
          </div>
        </section>

        <section className="mt-20 pb-16 md:mt-24">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Ready to get roof clarity?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
              Start with a Roof Condition Report request. Q2 will follow up to confirm fit, timing, and the best next step.
            </p>
            <Link className={`${primaryButtonClass} mt-6 inline-flex`} href={`/#${SECTION_IDS.quote}`}>
              {REQUEST_QUOTE_LABEL}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
