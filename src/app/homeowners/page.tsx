import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { QuoteForm } from "@/components/QuoteForm";
import {
  BUSINESS_NAME,
  REPORT_PAGE_PATH,
  REQUEST_QUOTE_LABEL,
  SERVICE_AREA,
} from "@/lib/business";
import { primaryButtonClass, secondaryButtonClass } from "@/lib/ui";

export const metadata: Metadata = {
  title: `Q2 Exterior Check | ${BUSINESS_NAME}`,
  description:
    "A first-look exterior check with drone photos, visible condition notes, and clear next steps for homeowners in Georgina and surrounding areas.",
};

const WHAT_HOMEOWNERS_RECEIVE = [
  "Drone roof overview photos where safe, legal, and appropriate",
  "Exterior and detail photos of visible concerns",
  "Plain-language visible condition notes",
  "Urgency and next-step context",
  "Optional repair recommendation or contractor handoff",
];

const WHEN_TO_USE = [
  "You are not sure whether to call a roofer yet",
  "You see possible roof, eavestrough, fascia, soffit, or exterior damage",
  "A leak, storm, wind, hail, or tree issue raised a concern",
  "You want photo documentation before requesting repair quotes",
  "You need a clearer first step before spending time on multiple calls",
  "You want a contractor-ready summary if repair follow-up is needed",
];

const LIMITS = [
  "First-look exterior documentation only",
  "Visible condition notes, not hidden-damage confirmation",
  "No roof access or ladder work promised",
  "Not a home inspection, engineering report, insurance adjustment, or warranty",
];

export default function HomeownersPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header ctaHref="#request-exterior-check" ctaLabel="Request Check" />
      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
        <section className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <p className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-900">
              Q2 Exterior Check
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-zinc-900 md:text-5xl">
              A first-look exterior check before you call multiple contractors.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
              Q2 helps homeowners understand visible roof and exterior concerns with drone-based exterior documentation, visible condition notes, and a clear next step.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a className={`${primaryButtonClass} inline-flex justify-center`} href="#request-exterior-check">
                {REQUEST_QUOTE_LABEL}
              </a>
              <Link className={`${secondaryButtonClass} inline-flex justify-center`} href={REPORT_PAGE_PATH}>
                What’s included
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200">
            <Image
              alt="Roof edge and eavestrough detail"
              className="object-cover"
              fill
              sizes="(min-width: 1280px) 32rem, (min-width: 1024px) 42vw, 100vw"
              src="/roof-edge.jpg"
            />
          </div>
        </section>

        <section className="mt-20 grid gap-6 md:mt-24 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-medium text-zinc-600">What You Receive</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              Clear exterior documentation for the next decision.
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              Use the report for your own records, to decide whether to request repair follow-up, or to support a cleaner contractor conversation.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {WHAT_HOMEOWNERS_RECEIVE.map((item) => (
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
              Built for homeowners who need a clearer first step.
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

        <section className="mt-20 grid gap-4 md:mt-24 lg:grid-cols-2">
          <article className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
            <p className="text-sm font-medium text-zinc-600">Local Service</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
              Serving {SERVICE_AREA}
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              Share the address, what prompted the concern, and any safe ground-level photos you already have. Q2 will confirm fit, timing, and whether an exterior check is the right next step.
            </p>
          </article>
          <article className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
            <p className="text-sm font-medium text-zinc-600">Clear Limits</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
              First-look documentation, not a certification.
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-600">
              {LIMITS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-20 pb-16 md:mt-24" id="request-exterior-check">
          <QuoteForm
            defaultJobType="Visible roof concern"
            heading="Request a Q2 Exterior Check"
            intent="q2_exterior_check"
            source="homeowners_page"
            submitLabel="Submit Exterior Check Request"
            successMessage="Thanks — we received your Q2 Exterior Check request. We’ll reply within 24 hours."
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
