import { FAQ_ITEMS, FAQ_SECTION_COPY } from "@/lib/business";

export function FAQ() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">{FAQ_SECTION_COPY.heading}</h2>
      <dl className="mt-6 space-y-5">
        {FAQ_ITEMS.map((item) => (
          <div key={item.question}>
            <dt className="font-medium text-zinc-900">{item.question}</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-600">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
