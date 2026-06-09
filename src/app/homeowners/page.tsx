import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HomeownerInspectionForm } from "@/components/QuoteForm";
import { ServiceCard } from "@/components/ServiceCard";
import { Step } from "@/components/Step";
import {
  HOMEOWNER_ITEMS,
  HOMEOWNER_SECTION_COPY,
  PROCESS_STEPS,
  SECTION_IDS,
  SERVICES,
  SERVICES_SECTION_COPY,
} from "@/lib/business";

const reportIncludes = [
  "Visible roof/eavestrough check",
  "Photos and drone documentation where appropriate",
  "Issue summary",
  "Homeowner notes",
  "Contractor-ready handoff package",
];

export default function HomeownersPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />
      <main className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <section className="pb-14 pt-20 md:pb-16 md:pt-24">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="text-sm font-medium text-zinc-600">{HOMEOWNER_SECTION_COPY.eyebrow}</p>
              <h1 className="mt-2 text-4xl font-semibold leading-tight tracking-tight text-zinc-900 md:text-5xl">
                Start with a documented exterior inspection
              </h1>
              <p className="mt-4 max-w-prose text-lg leading-8 text-zinc-600">
                Q2 helps homeowners document visible exterior issues before requesting repair or replacement quotes.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200">
              <Image
                alt="Eavestrough and downspout on a modern home in light rain"
                className="object-cover"
                fill
                sizes="(min-width: 1280px) 32rem, (min-width: 1024px) 42vw, 100vw"
                src="/eaves-rain.jpg"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Inspections, quick checks, and contractor-ready documentation
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">{HOMEOWNER_SECTION_COPY.description}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
            <ul className="space-y-3 text-sm leading-6 text-zinc-700">
              {HOMEOWNER_ITEMS.map((item) => (
                <li className="flex gap-3" key={item}>
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-900" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-16 space-y-6 md:mt-20" id={SECTION_IDS.services}>
          <div>
            <p className="text-sm font-medium text-zinc-600">{SERVICES_SECTION_COPY.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              {SERVICES_SECTION_COPY.heading}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service) => (
              <ServiceCard description={service.description} key={service.title} title={service.title} />
            ))}
          </div>
          <p className="text-sm font-medium text-zinc-700">{SERVICES_SECTION_COPY.note}</p>
        </section>

        <section className="mt-16 rounded-xl bg-blue-50 p-6 sm:p-8 md:mt-20 lg:p-10" id={SECTION_IDS.process}>
          <p className="text-sm font-medium text-zinc-600">Homeowner Process</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
            How Q2 prepares a contractor-ready package
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS_STEPS.map((step, index) => (
              <Step description={step.description} key={step.title} number={index + 1} title={step.title} />
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-6 md:mt-20 lg:grid-cols-2">
          <article className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">What the inspection/report includes</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-zinc-700">
              {reportIncludes.map((item) => (
                <li className="flex gap-3" key={item}>
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-900" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Before contractor quotes</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              Repairs and contractor quotes are sold separately. If you move forward with a vetted Q2 contractor
              partner, the inspection fee may be credited toward the final project invoice.
            </p>
          </article>
        </section>

        <section className="mt-16 pb-16 md:mt-20 md:pb-20" id="inspection-request">
          <HomeownerInspectionForm />
        </section>
      </main>
      <Footer />
    </div>
  );
}
