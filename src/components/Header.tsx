import {
  BUSINESS_NAME,
  CALL_TO_ACTION_LABEL,
  HOME_PATH,
  NAV_ITEMS,
  PHONE_DISPLAY,
  PHONE_TEL,
  SECTION_IDS,
  TAGLINE,
} from "@/lib/business";
import { linkClass, secondaryButtonClass } from "@/lib/ui";

export function Header() {
  const hasPhone = Boolean(PHONE_DISPLAY && PHONE_TEL);

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:px-12">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-900">{BUSINESS_NAME}</p>
          <p className="text-xs text-zinc-600">{TAGLINE}</p>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-zinc-700 md:flex">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} className={`${linkClass} transition-colors`} href={item.href}>
              {item.label}
            </a>
          ))}
          {hasPhone ? (
            <a
              className={`${secondaryButtonClass} px-4 py-2`}
              href={`tel:${PHONE_TEL}`}
            >
              {CALL_TO_ACTION_LABEL} {PHONE_DISPLAY}
            </a>
          ) : null}
        </nav>
        <a
          className={`${secondaryButtonClass} inline-flex shrink-0 px-4 py-2 text-xs md:hidden`}
          href={`${HOME_PATH}#${SECTION_IDS.quote}`}
        >
          Book Report
        </a>
      </div>
    </header>
  );
}
