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
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 sm:px-8 lg:px-12">
        <div>
          <p className="text-sm font-semibold text-zinc-900">{BUSINESS_NAME}</p>
          <p className="text-xs text-zinc-600">{TAGLINE}</p>
        </div>
        <nav className="flex items-center gap-6 text-sm text-zinc-700">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} className={`${linkClass} transition-colors`} href={item.href}>
              {item.label}
            </a>
          ))}
          {hasPhone ? (
            <a
              className={`${secondaryButtonClass} hidden px-4 py-2 sm:inline-flex`}
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
