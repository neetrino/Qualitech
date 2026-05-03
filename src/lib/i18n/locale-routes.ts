import type { HomeLocale } from "@/features/home/home.messages";

/** Matches localized home URLs: `/en`, `/ru`. */
export const LOCALIZED_HOME_PATH = /^\/(en|ru)$/;

/** Matches localized contact URLs: `/en/contact`, `/ru/contact`. */
export const LOCALIZED_CONTACT_PATH = /^\/(en|ru)\/contact$/;

/** Matches localized about URLs: `/en/about`, `/ru/about`. */
export const LOCALIZED_ABOUT_PATH = /^\/(en|ru)\/about$/;

/** Matches `/en/blog`, `/ru/blog` (no trailing segment). */
export const LOCALIZED_BLOG_LIST_PATH = /^\/(en|ru)\/blog$/;

/** Matches `/en/blog/my-post`, `/ru/blog/my-post`. */
export const LOCALIZED_BLOG_POST_PATH = /^\/(en|ru)\/blog\/[^/]+$/;

/** `/en/machines`, `/ru/machines` (index only). */
export const LOCALIZED_MACHINES_INDEX_PATH = /^\/(en|ru)\/machines$/;

/** `/en/machines/cnc`, `/ru/machines/stanki` (section listing). */
export const LOCALIZED_MACHINES_SECTION_PATH = /^\/(en|ru)\/machines\/([^/]+)$/;

/** `/en/machines/cnc/demo`, nested product detail. */
export const LOCALIZED_MACHINES_DETAIL_PATH = /^\/(en|ru)\/machines\/([^/]+)\/([^/]+)$/;

export function isHomeLocaleSegment(value: string): value is HomeLocale {
  return value === "en" || value === "ru";
}

export function homePageHref(locale: HomeLocale): string {
  return `/${locale}`;
}

export function contactPageHref(locale: HomeLocale): string {
  return `/${locale}/contact`;
}

export function aboutPageHref(locale: HomeLocale): string {
  return `/${locale}/about`;
}

export function blogPageHref(locale: HomeLocale): string {
  return `/${locale}/blog`;
}

export function blogPostHref(locale: HomeLocale, slug: string): string {
  return `/${locale}/blog/${encodeURIComponent(slug)}`;
}

export function machinesPageHref(locale: HomeLocale): string {
  return `/${locale}/machines`;
}

/**
 * Encodes a single path segment for `/machines/...` URLs. `encodeURIComponent` leaves `.` as-is;
 * unencoded dots in the last segment are often treated as static file extensions (404).
 */
function encodeMachinesPathSegment(segment: string): string {
  return encodeURIComponent(segment).replaceAll(".", "%2E");
}

export function machinesCategoryHref(locale: HomeLocale, categorySlug: string): string {
  return `/${locale}/machines/${encodeMachinesPathSegment(categorySlug)}`;
}

export function machineDetailHref(
  locale: HomeLocale,
  categorySlug: string,
  machineSlug: string,
): string {
  return `/${locale}/machines/${encodeMachinesPathSegment(categorySlug)}/${encodeMachinesPathSegment(machineSlug)}`;
}

/** Language switch when both section and machine slugs exist per locale. */
export function machineDetailPathForLocaleSwitch(
  next: HomeLocale,
  sectionSlugByLocale: Partial<Record<HomeLocale, string>>,
  machineSlugByLocale: Partial<Record<HomeLocale, string>>,
): string {
  const section = sectionSlugByLocale[next];
  const machine = machineSlugByLocale[next];
  if (section && machine) {
    return machineDetailHref(next, section, machine);
  }
  return machinesPageHref(next);
}

/** Language switch for section listing `/[locale]/machines/[sectionSlug]`. */
export function machinesSectionPathForLocaleSwitch(
  next: HomeLocale,
  sectionSlugByLocale: Partial<Record<HomeLocale, string>>,
): string {
  const section = sectionSlugByLocale[next];
  if (section) {
    return machinesCategoryHref(next, section);
  }
  return machinesPageHref(next);
}

/** Client-side language switch on a blog article (plain data only — no functions). */
export function blogPostPathForLocaleSwitch(
  next: HomeLocale,
  slugByLocale: Partial<Record<HomeLocale, string>>,
): string {
  const slug = slugByLocale[next];
  if (slug) {
    return blogPostHref(next, slug);
  }
  return blogPageHref(next);
}
