import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HERO_COPY, SECTION_IDS } from "@/lib/business";
import { primaryButtonClass, secondaryButtonClass } from "@/lib/ui";

const frontDoorCards = [
  {
    title: "For Homeowners",
    description:
      "Book an exterior inspection, get photo documentation, and decide whether you want a vetted contractor quote.",
    href: "/homeowners",
    cta: "Book an Inspection",
  },
  {
    title: "For Contractors",
    description:
      "Apply to join Q2's private contractor partner network for qualified exterior opportunities.",
    href: "/contractors",
    cta: "Apply as a Partner",
  },
];

const q2Steps = [
  {
    title: "Inspect",
    description: "Q2 checks visible roof, eavestrough, and exterior issues.",
  },
  {
    title: "Document",
    description: "Photos, drone views where appropriate, notes, and basic report details are collected.",
  },
  {
    title: "Qualify",
    description: "Homeowner urgency, issue type, address, and consent are confirmed before handoff.",
  },
  {
    title: "Connect",
    description: "With permission, the package is sent to a vetted local contractor partner.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />
      <main className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <section className="pb-14 pt-20 md:pb-16 md:pt-24" id={SECTION_IDS.hero}>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="max-w-2xl">
              <p className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-900">
                Exterior inspection, documentation & contractor handoff
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-zinc-900 md:text-5xl">
                {HERO_COPY.heading}
              </h1>
              <p className="mt-4 max-w-prose text-lg leading-8 text-zinc-600">{HERO_COPY.description}</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link className={`${primaryButtonClass} inline-flex justify-center`} href="/homeowners">
                  Book an Inspection
                </Link>
                <Link className={`${secondaryButtonClass} inline-flex justify-center`} href="/contractors">
                  Apply as a Contractor
                </Link>
              </div>
            </div>
            <div className="w-full max-w-lg lg:justify-self-end">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200">
                <Image
                  alt="Roof edge and eavestrough detail"
                  className="object-cover"
                  fill
                  priority
                  sizes="(min-width: 1280px) 32rem, (min-width: 1024px) 42vw, 100vw"
                  src="/roof-edge.jpg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2" id={SECTION_IDS.trust}>
          {frontDoorCards.map((card) => (
            <Link
              className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md"
              href={card.href}
              key={card.title}
            >
              <h2 className="text-xl font-semibold text-zinc-900">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{card.description}</p>
              <p className="mt-5 text-sm font-semibold text-blue-900">{card.cta}</p>
            </Link>
          ))}
        </section>

        <section className="mt-16 rounded-xl bg-blue-50 p-6 sm:p-8 md:mt-20 lg:p-10" id={SECTION_IDS.process}>
          <p className="text-sm font-medium text-zinc-600">How Q2 Works</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
            Inspect. Document. Qualify. Connect.
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {q2Steps.map((step) => (
              <article className="rounded-xl border border-zinc-200 bg-white p-5" key={step.title}>
                <h3 className="text-lg font-semibold text-zinc-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-6 md:mt-20 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
            <p className="text-sm font-medium text-zinc-600">Private Partner Network</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
              Not an open contractor marketplace
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              Q2 is not an open contractor marketplace. Contractors apply and are reviewed before receiving homeowner
              opportunities.
            </p>
          </article>
          <article className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
            <p className="text-sm font-medium text-zinc-600">Ready to start?</p>
            <div className="mt-5 flex flex-col gap-3">
              <Link className={`${primaryButtonClass} inline-flex justify-center`} href="/homeowners">
                Book an Inspection
              </Link>
              <Link className={`${secondaryButtonClass} inline-flex justify-center`} href="/contractors">
                Apply as a Contractor
              </Link>
            </div>
          </article>
        </section>
      </main>
      <section className="mt-16 md:mt-20" id={SECTION_IDS.footer}>
        <Footer />
      </section>
    </div>
  );
}
