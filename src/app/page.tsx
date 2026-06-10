import Link from "next/link";
import Image from "next/image";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { QuoteForm } from "@/components/QuoteForm";
import { Step } from "@/components/Step";
import {
  AUDIENCE_SECTION_COPY,
  CALL_TO_ACTION_LABEL,
  CLARITY_SECTION_COPY,
  CONTRACTOR_CARD,
  HERO_COPY,
  HOMEOWNER_CARD,
  PARTNER_NETWORK_COPY,
  PHONE_DISPLAY,
  PHONE_TEL,
  PROCESS_SECTION_COPY,
  PROCESS_STEPS,
  REPORT_INCLUDED_SECTION_COPY,
  REPORT_PAGE_PATH,
  REQUEST_QUOTE_LABEL,
  SECTION_IDS,
  SERVICE_AREA,
  SERVICE_AREA_SECTION_COPY,
  TRUST_ITEMS,
  WHY_HOMEOWNERS_ITEMS,
  WHY_HOMEOWNERS_SECTION_COPY,
} from "@/lib/business";
import { primaryButtonClass, secondaryButtonClass } from "@/lib/ui";

export default function Home() {
  const hasPhone = Boolean(PHONE_DISPLAY && PHONE_TEL);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />
      <main className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <section className="pb-16 pt-24 md:pb-20 md:pt-28" id={SECTION_IDS.hero}>
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="max-w-2xl">
              <p className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-900">
                {HERO_COPY.eyebrow}
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-zinc-900 md:text-5xl">
                {HERO_COPY.heading}
              </h1>
              <p className="mt-4 max-w-prose text-lg leading-8 text-zinc-600">{HERO_COPY.description}</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  className={`${primaryButtonClass} inline-flex items-center justify-center`}
                  href={`#${SECTION_IDS.quote}`}
                >
                  {REQUEST_QUOTE_LABEL}
                </a>
                <a
                  className={`${secondaryButtonClass} inline-flex items-center justify-center`}
                  href={CONTRACTOR_CARD.href}
                >
                  {CONTRACTOR_CARD.ctaLabel}
                </a>
              </div>
              {hasPhone ? (
                <p className="mt-5 text-sm text-zinc-600">
                  Prefer to talk first?{" "}
                  <a className="font-medium text-blue-900 underline-offset-2 hover:underline" href={`tel:${PHONE_TEL}`}>
                    {CALL_TO_ACTION_LABEL} {PHONE_DISPLAY}
                  </a>
                  .
                </p>
              ) : null}
            </div>
            <div className="w-full max-w-lg lg:justify-self-end">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200">
                <Image
                  src="/roof-edge.jpg"
                  alt="Roof edge and eavestrough detail"
                  priority
                  fill
                  sizes="(min-width: 1280px) 32rem, (min-width: 1024px) 42vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-3"
          id={SECTION_IDS.trust}
        >
          {TRUST_ITEMS.map((item) => (
            <p key={item} className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
              {item}
            </p>
          ))}
        </section>

        <section className="mt-20 space-y-6 md:mt-24" id={SECTION_IDS.audience}>
          <div>
            <p className="text-sm font-medium text-zinc-600">{AUDIENCE_SECTION_COPY.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              {AUDIENCE_SECTION_COPY.heading}
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
              <p className="text-sm font-medium text-blue-900">{HOMEOWNER_CARD.eyebrow}</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
                {HOMEOWNER_CARD.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-zinc-600">{HOMEOWNER_CARD.description}</p>
              <a className={`${primaryButtonClass} mt-6 inline-flex`} href={HOMEOWNER_CARD.href}>
                {HOMEOWNER_CARD.ctaLabel}
              </a>
            </article>
            <article className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
              <p className="text-sm font-medium text-blue-900">{CONTRACTOR_CARD.eyebrow}</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
                {CONTRACTOR_CARD.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-zinc-600">{CONTRACTOR_CARD.description}</p>
              <a className={`${secondaryButtonClass} mt-6 inline-flex`} href={CONTRACTOR_CARD.href}>
                {CONTRACTOR_CARD.ctaLabel}
              </a>
            </article>
          </div>
        </section>

        <section className="mt-20 md:mt-24">
          <div className="mx-auto max-w-6xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-zinc-200">
              <Image
                src="/eaves-rain.jpg"
                alt="Eavestrough and downspout on a modern home in light rain"
                fill
                sizes="(min-width: 1280px) 72rem, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mt-20 rounded-xl bg-blue-50 p-6 sm:p-8 md:mt-24 lg:p-10" id={SECTION_IDS.process}>
          <div className="space-y-6">
            <p className="text-sm font-medium text-zinc-600">{PROCESS_SECTION_COPY.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">{PROCESS_SECTION_COPY.heading}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS_STEPS.map((step, index) => (
                <Step key={step.title} description={step.description} number={index + 1} title={step.title} />
              ))}
            </div>
            <Link className={`${secondaryButtonClass} inline-flex`} href={`${REPORT_PAGE_PATH}#example-report`}>
              View Example Report
            </Link>
          </div>
        </section>

        <section className="mt-20 md:mt-24" id={SECTION_IDS.reportIncluded}>
          <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
            <p className="text-sm font-medium text-zinc-600">{REPORT_INCLUDED_SECTION_COPY.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              {REPORT_INCLUDED_SECTION_COPY.heading}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-600">
              {REPORT_INCLUDED_SECTION_COPY.description}
            </p>
            <Link className={`${secondaryButtonClass} mt-6 inline-flex`} href={REPORT_PAGE_PATH}>
              {REPORT_INCLUDED_SECTION_COPY.ctaLabel}
            </Link>
          </div>
        </section>

        <section className="mt-20 grid gap-6 md:mt-24 lg:grid-cols-[0.85fr_1.15fr]" id={SECTION_IDS.whyHomeowners}>
          <div>
            <p className="text-sm font-medium text-zinc-600">{WHY_HOMEOWNERS_SECTION_COPY.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              {WHY_HOMEOWNERS_SECTION_COPY.heading}
            </h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {WHY_HOMEOWNERS_ITEMS.map((item) => (
              <li key={item} className="rounded-xl border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-700">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20 rounded-xl bg-blue-50 p-6 sm:p-8 md:mt-24 lg:p-10" id={SECTION_IDS.clarity}>
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

        <section className="mt-20 md:mt-24" id={SECTION_IDS.partnerNetwork}>
          <article className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
            <p className="text-sm font-medium text-zinc-600">{PARTNER_NETWORK_COPY.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              {PARTNER_NETWORK_COPY.heading}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-600">{PARTNER_NETWORK_COPY.description}</p>
            <a className={`${secondaryButtonClass} mt-6 inline-flex`} href={CONTRACTOR_CARD.href}>
              {CONTRACTOR_CARD.ctaLabel}
            </a>
          </article>
        </section>

        <section className="mt-20 grid gap-6 lg:grid-cols-2 md:mt-24" id={SECTION_IDS.serviceArea}>
          <article className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
            <p className="text-sm font-medium text-zinc-600">{SERVICE_AREA_SECTION_COPY.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">{SERVICE_AREA}</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">{SERVICE_AREA_SECTION_COPY.description}</p>
            {hasPhone ? (
              <a
                className={`${secondaryButtonClass} mt-6 inline-flex`}
                href={`tel:${PHONE_TEL}`}
              >
                {CALL_TO_ACTION_LABEL} {PHONE_DISPLAY}
              </a>
            ) : null}
          </article>
          <FAQ />
        </section>

        <section className="mt-20 pb-16 md:mt-24 md:pb-20" id={SECTION_IDS.quote}>
          <QuoteForm />
        </section>
      </main>
      <section id={SECTION_IDS.footer}>
        <Footer />
      </section>
    </div>
  );
}
