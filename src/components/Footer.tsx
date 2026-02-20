import {
  BUSINESS_NAME,
  FOOTER_COPY,
  PHONE_DISPLAY,
  PHONE_TEL,
  SERVICE_AREA,
} from "@/lib/business";

export function Footer() {
  const hasPhone = Boolean(PHONE_DISPLAY && PHONE_TEL);

  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 text-sm text-zinc-600 sm:px-8 lg:px-12">
        <p className="font-medium text-zinc-900">{BUSINESS_NAME}</p>
        <p>{SERVICE_AREA}</p>
        {hasPhone ? (
          <p>
            {FOOTER_COPY.phoneLabel}:{" "}
            <a
              className="text-zinc-900 underline-offset-2 transition-colors hover:text-blue-900 hover:underline"
              href={`tel:${PHONE_TEL}`}
            >
              {PHONE_DISPLAY}
            </a>
          </p>
        ) : null}
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} {BUSINESS_NAME}. {FOOTER_COPY.rightsLabel}
        </p>
      </div>
    </footer>
  );
}
