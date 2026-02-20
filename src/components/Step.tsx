type StepProps = {
  number: number;
  title: string;
  description: string;
};

export function Step({ number, title, description }: StepProps) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 text-sm font-semibold text-zinc-800">
        {number}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
    </article>
  );
}
