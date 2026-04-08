import Link from "next/link";

export type SiteBreadcrumbSegment = {
  readonly label: string;
  /** Omit on the current (last) segment. */
  readonly href?: string;
};

type SiteBreadcrumbProps = {
  readonly segments: readonly SiteBreadcrumbSegment[];
  readonly className?: string;
};

const NAV_CLASS =
  "mb-6 text-[11px] font-medium uppercase tracking-[0.12em] text-[#71717b]";
const LINK_CLASS = "text-[#ff6900] transition hover:brightness-110";
const SEP_CLASS = "mx-2 text-[#3f3f46]";
const CURRENT_CLASS = "text-[#d4d4d8]";

export function SiteBreadcrumb({ segments, className = "" }: SiteBreadcrumbProps) {
  if (segments.length === 0) {
    return null;
  }
  return (
    <nav aria-label="Breadcrumb" className={`${NAV_CLASS} ${className}`.trim()}>
      <ol className="m-0 flex list-none flex-wrap items-center p-0">
        {segments.map((segment, index) => (
          <li key={`${index}-${segment.label}`} className="flex items-center">
            {index > 0 ? (
              <span aria-hidden className={SEP_CLASS}>
                /
              </span>
            ) : null}
            {segment.href !== undefined ? (
              <Link className={LINK_CLASS} href={segment.href}>
                {segment.label}
              </Link>
            ) : (
              <span aria-current="page" className={CURRENT_CLASS}>
                {segment.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
