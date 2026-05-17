import {
  BUSINESS_NAME,
  CALL_TO_ACTION_LABEL,
  EMAIL,
  EMAIL_MAILTO,
  NAV_ITEMS,
  PHONE_DISPLAY,
  PHONE_TEL,
  TAGLINE,
} from "@/lib/business";
import { linkClass, primaryButtonClass } from "@/lib/ui";

export function Header() {
  const hasPhone = Boolean(PHONE_DISPLAY && PHONE_TEL);

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4 sm:px-8 md:flex-row md:items-center md:justify-between md:gap-6 lg:px-12">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-900">{BUSINESS_NAME}</p>
          <p className="text-xs text-zinc-600">{TAGLINE}</p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-700 md:justify-end">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} className={`${linkClass} transition-colors`} href={item.href}>
              {item.label}
            </a>
          ))}
          <a
            className="break-all text-xs font-medium text-zinc-700 underline-offset-2 transition-colors hover:text-blue-900 hover:underline sm:text-sm"
            href={EMAIL_MAILTO}
          >
            {EMAIL}
          </a>
          {hasPhone ? (
            <a
              className={`${primaryButtonClass} px-4 py-2`}
              href={`tel:${PHONE_TEL}`}
            >
              {CALL_TO_ACTION_LABEL} {PHONE_DISPLAY}
            </a>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
