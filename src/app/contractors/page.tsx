import type { Metadata } from "next";
import { ContractorApplicationForm } from "@/components/ContractorApplicationForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  BUSINESS_NAME,
  CONTRACTOR_PAGE_COPY,
  EMAIL,
  PHONE_DISPLAY,
  PHONE_TEL,
  SERVICE_AREA,
} from "@/lib/business";

export const metadata: Metadata = {
  title: `Contractor Partner Application | ${BUSINESS_NAME}`,
  description:
    "Apply to join Q2’s reviewed local exterior contractor partner network for homeowner opportunities after Roof Condition Reports.",
};

export default function ContractorsPage() {
  const hasPhone = Boolean(PHONE_DISPLAY && PHONE_TEL);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
        <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-900">
              {CONTRACTOR_PAGE_COPY.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-zinc-900 md:text-5xl">
              {CONTRACTOR_PAGE_COPY.heading}
            </h1>
            <p className="mt-4 text-lg leading-8 text-zinc-600">
              {CONTRACTOR_PAGE_COPY.description}
            </p>
            <div className="mt-8 space-y-4 rounded-xl bg-blue-50 p-6">
              <p className="text-sm leading-7 text-zinc-700">
                {CONTRACTOR_PAGE_COPY.trust}
              </p>
              <p className="text-sm leading-7 text-zinc-700">
                {CONTRACTOR_PAGE_COPY.fitNote}
              </p>
            </div>
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-zinc-900">What Q2 reviews</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-600">
                <li>Exterior trade fit and services offered</li>
                <li>Regular service area around {SERVICE_AREA}</li>
                <li>Insurance / WSIB status and business details</li>
                <li>Preferred job types and homeowner communication fit</li>
              </ul>
            </div>
            <p className="mt-8 text-sm leading-6 text-zinc-600">
              Prefer to ask a question first?{" "}
              <a className="font-medium text-blue-900 underline-offset-2 hover:underline" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
              {hasPhone ? (
                <>
                  {" "}
                  or{" "}
                  <a className="font-medium text-blue-900 underline-offset-2 hover:underline" href={`tel:${PHONE_TEL}`}>
                    {PHONE_DISPLAY}
                  </a>
                </>
              ) : null}
            </p>
          </div>
          <ContractorApplicationForm />
        </section>
      </main>
      <Footer />
    </div>
  );
}
