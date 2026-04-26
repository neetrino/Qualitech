import Image from "next/image";
import Link from "next/link";

import { normalizeHomeSolutionBulletLines } from "@/features/home/home-solution-bullets";
import { isRemoteImageUrl } from "@/lib/image/remote-image-url";

const IMAGE_AREA_CLASS = "relative h-[188px] overflow-hidden sm:h-[208px] lg:h-[224px]";
const CARD_SHELL_CLASS =
  "block overflow-hidden rounded-xl border border-[#18181b] bg-[#09090b] transition hover:border-[#27272a]";

/** Matches home #solutions overlay number horizontal offset by card index (0-based). */
export function solutionCardOverlayPositionClass(index: number): string {
  const mod = index % 3;
  if (mod === 0) {
    return "right-4";
  }
  if (mod === 1) {
    return "right-5";
  }
  return "right-6";
}

export type MachineCategorySolutionCardProps = {
  readonly href: string;
  readonly title: string;
  readonly description: string;
  readonly bullets: readonly string[];
  readonly ctaLabel: string;
  readonly ctaArrowSrc: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly overlayIndex: string;
  readonly overlayNumberPositionClassName: string;
};

export function MachineCategorySolutionCard({
  href,
  title,
  description,
  bullets,
  ctaLabel,
  ctaArrowSrc,
  imageSrc,
  imageAlt,
  overlayIndex,
  overlayNumberPositionClassName,
}: MachineCategorySolutionCardProps) {
  const trimmedDescription = description.trim();
  const bulletLines = normalizeHomeSolutionBulletLines(bullets);
  const trimmedImageSrc = imageSrc.trim();
  const hasImage = trimmedImageSrc.length > 0;

  return (
    <Link className={CARD_SHELL_CLASS} href={href}>
      <article>
        <div className={IMAGE_AREA_CLASS}>
          {hasImage ? (
            <Image
              alt={imageAlt}
              className="object-cover"
              fill
              sizes="(min-width: 1280px) 400px, 100vw"
              src={trimmedImageSrc}
              unoptimized={isRemoteImageUrl(trimmedImageSrc)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#18181b] text-[11px] font-bold uppercase tracking-[0.14em] text-[#52525c]">
              Qualitech
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090b] via-[rgba(9,9,11,0.4)] to-transparent" />
          <span
            className={`pointer-events-none absolute top-3 text-5xl font-black leading-none text-white sm:top-4 sm:text-6xl ${overlayNumberPositionClassName}`}
          >
            {overlayIndex}
          </span>
        </div>
        <div className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          <div className="mb-5 h-0.5 w-[70%] rounded-full bg-[#ff6900]" />
          <h3 className="max-w-[320px] text-base font-black leading-snug text-white sm:text-lg">{title}</h3>
          {trimmedDescription.length > 0 ? (
            <p className="mt-3 max-w-none text-xs leading-relaxed tracking-[-0.02em] text-[#71717b] sm:mt-4 sm:text-sm">
              {trimmedDescription}
            </p>
          ) : null}
          {bulletLines.length > 0 ? (
            <ul className="mt-6 space-y-2 sm:mt-7">
              {bulletLines.map((bullet, bulletIndex) => (
                <li
                  key={`${overlayIndex}-${bulletIndex}-${bullet.slice(0, 48)}`}
                  className="flex items-start gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#52525c] sm:gap-2.5 sm:text-xs sm:tracking-[0.12em]"
                >
                  <span
                    aria-hidden
                    className="mt-[0.42em] size-1 shrink-0 rounded-full bg-[#ff6900] sm:mt-[0.45em]"
                  />
                  <span className="min-w-0 flex-1 leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <span className="mt-6 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#ff6900] sm:mt-7 sm:text-xs sm:tracking-[0.14em]">
            {ctaLabel}
            <Image alt="" height={20} src={ctaArrowSrc} width={20} />
          </span>
        </div>
      </article>
    </Link>
  );
}
