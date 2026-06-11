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

type HeaderProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

export function Header({
  ctaHref = `${HOME_PATH}#${SECTION_IDS.quote}`,
  ctaLabel = "Request Check",
}: HeaderProps) {
  const hasPhone = Boolean(PHONE_DISPLAY && PHONE_TEL);
  const defaultCtaHref = `${HOME_PATH}#${SECTION_IDS.quote}`;

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:px-12">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-900">{BUSINESS_NAME}</p>
          <p className="text-xs text-zinc-600">{TAGLINE}</p>
        </div>
        <nav className="hidden items-center gap-4 text-sm text-zinc-700 lg:flex xl:gap-6">
          {NAV_ITEMS.map((item) => {
            const isCtaItem = item.href === defaultCtaHref;

            return (
              <a
                key={item.href}
                className={`${linkClass} transition-colors`}
                href={isCtaItem ? ctaHref : item.href}
              >
                {isCtaItem ? ctaLabel : item.label}
              </a>
            );
          })}
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
          className={`${secondaryButtonClass} inline-flex shrink-0 px-4 py-2 text-xs lg:hidden`}
          href={ctaHref}
        >
          {ctaLabel}
        </a>
      </div>
    </header>
  );
}
