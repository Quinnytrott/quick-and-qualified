import Image from "next/image";
import { ContractorApplicationForm } from "@/components/QuoteForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  CONTRACTOR_ITEMS,
  CONTRACTOR_SECTION_COPY,
  CONTRACTOR_VETTING_ITEMS,
  SECTION_IDS,
  VETTING_SECTION_COPY,
} from "@/lib/business";

const opportunityIncludes = [
  "Homeowner info",
  "Property address",
  "Issue type",
  "Urgency",
  "Homeowner notes",
  "Photos/drone documentation where available",
  "Basic measurements/report info where available",
  "Homeowner consent",
];

export default function ContractorsPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />
      <main className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <section className="pb-14 pt-20 md:pb-16 md:pt-24">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="text-sm font-medium text-zinc-600">{CONTRACTOR_SECTION_COPY.eyebrow}</p>
              <h1 className="mt-2 text-4xl font-semibold leading-tight tracking-tight text-zinc-900 md:text-5xl">
                Apply to receive qualified exterior opportunities
              </h1>
              <p className="mt-4 max-w-prose text-lg leading-8 text-zinc-600">
                Q2 documents and qualifies homeowner exterior requests before sharing opportunities with reviewed
                contractor partners.
              </p>
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
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2" id={SECTION_IDS.contractors}>
          <article className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Private Q2 partner network</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">{CONTRACTOR_SECTION_COPY.description}</p>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-zinc-700">
              {CONTRACTOR_ITEMS.map((item) => (
                <li className="flex gap-3" key={item}>
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-900" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">What a Q2 opportunity includes</h2>
            <ul className="mt-5 grid gap-3 text-sm leading-6 text-zinc-700 sm:grid-cols-2">
              {opportunityIncludes.map((item) => (
                <li className="flex gap-3" key={item}>
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-900" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-16 space-y-6 md:mt-20" id={SECTION_IDS.vetting}>
          <div>
            <p className="text-sm font-medium text-zinc-600">{VETTING_SECTION_COPY.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              {VETTING_SECTION_COPY.heading}
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CONTRACTOR_VETTING_ITEMS.map((item) => (
              <p className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700" key={item}>
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-16 pb-16 md:mt-20 md:pb-20" id="contractor-application">
          <ContractorApplicationForm />
        </section>
      </main>
      <Footer />
    </div>
  );
}
