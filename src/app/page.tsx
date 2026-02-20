import Image from "next/image";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { QuoteForm } from "@/components/QuoteForm";
import { ServiceCard } from "@/components/ServiceCard";
import { Step } from "@/components/Step";
import {
  BEST_FIT_JOBS,
  CALL_TO_ACTION_LABEL,
  HERO_COPY,
  NOT_A_FIT_JOBS,
  PHONE_DISPLAY,
  PHONE_TEL,
  PROCESS_SECTION_COPY,
  PROCESS_STEPS,
  REQUEST_QUOTE_LABEL,
  SECTION_IDS,
  SERVICE_AREA,
  SERVICE_AREA_SECTION_COPY,
  SERVICES,
  SERVICES_SECTION_COPY,
  TRUST_ITEMS,
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
                {hasPhone ? (
                  <a
                    className={`${secondaryButtonClass} inline-flex items-center justify-center`}
                    href={`tel:${PHONE_TEL}`}
                  >
                    {CALL_TO_ACTION_LABEL} {PHONE_DISPLAY}
                  </a>
                ) : null}
              </div>
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

        <section className="mt-20 space-y-6 md:mt-24" id={SECTION_IDS.services}>
          <div>
            <p className="text-sm font-medium text-zinc-600">{SERVICES_SECTION_COPY.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              {SERVICES_SECTION_COPY.heading}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <ServiceCard key={service.title} description={service.description} title={service.title} />
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-xl border border-zinc-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-zinc-900">{SERVICES_SECTION_COPY.bestFitTitle}</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-600">
                {BEST_FIT_JOBS.map((job) => (
                  <li key={job}>{job}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-xl border border-zinc-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-zinc-900">{SERVICES_SECTION_COPY.notFitTitle}</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-600">
                {NOT_A_FIT_JOBS.map((job) => (
                  <li key={job}>{job}</li>
                ))}
              </ul>
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
          </div>
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
