import {
  BUSINESS_NAME,
  CALL_TO_ACTION_LABEL,
  NAV_ITEMS,
  PHONE_DISPLAY,
  PHONE_TEL,
  TAGLINE,
} from "@/lib/business";
import { linkClass, secondaryButtonClass } from "@/lib/ui";

export function Header() {
  const hasPhone = Boolean(PHONE_DISPLAY && PHONE_TEL);

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-900">{BUSINESS_NAME}</p>
            <p className="text-xs text-zinc-600">{TAGLINE}</p>
          </div>
          <nav className="hidden items-center gap-4 text-sm text-zinc-700 lg:flex xl:gap-6">
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
          {hasPhone ? (
            <a
              className={`${secondaryButtonClass} inline-flex shrink-0 px-4 py-2 text-xs lg:hidden`}
              href={`tel:${PHONE_TEL}`}
            >
              {CALL_TO_ACTION_LABEL}
            </a>
          ) : null}
        </div>
        <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-700 lg:hidden">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} className={`${linkClass} transition-colors`} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
