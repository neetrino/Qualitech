import type { HomeLocale } from "@/features/home/home.messages";
import {
  SEO_DEFAULT_LOCALE,
  SEO_HOME_LOCALES,
  SITEMAP_CHANGE_FREQ_HOME,
  SITEMAP_CHANGE_FREQ_SECTION,
  SITEMAP_PRIORITY_DETAIL,
  SITEMAP_PRIORITY_HOME,
  SITEMAP_PRIORITY_SECTION,
} from "@/features/seo/seo.constants";
import type {
  SitemapBlogPostRow,
  SitemapCategoryRow,
  SitemapHreflang,
  SitemapMachineRow,
  SitemapUrlEntry,
} from "@/features/seo/seo.types";
import {
  findPublishedSitemapBlogPosts,
  findPublishedSitemapCategories,
  findPublishedSitemapMachines,
} from "@/features/seo/sitemap.repository";
import {
  aboutPageHref,
  blogPageHref,
  blogPostHref,
  contactPageHref,
  homePageHref,
  machineDetailHref,
  machinesCategoryHref,
  machinesPageHref,
} from "@/lib/i18n/locale-routes";
import { logger } from "@/lib/logger";
import { getSiteOrigin } from "@/lib/site-origin";

function absoluteUrl(origin: string, path: string): string {
  return `${origin}${path}`;
}

function alternateMap(
  origin: string,
  locales: readonly HomeLocale[],
  hrefFor: (locale: HomeLocale) => string,
): Partial<Record<SitemapHreflang, string>> {
  const out: Partial<Record<SitemapHreflang, string>> = {};
  for (const loc of locales) {
    out[loc] = absoluteUrl(origin, hrefFor(loc));
  }
  const defaultLoc = locales.includes(SEO_DEFAULT_LOCALE) ? SEO_DEFAULT_LOCALE : locales[0];
  if (defaultLoc) {
    out["x-default"] = absoluteUrl(origin, hrefFor(defaultLoc));
  }
  return out;
}

function entriesForPath(
  origin: string,
  include: readonly HomeLocale[],
  available: readonly HomeLocale[],
  hrefFor: (locale: HomeLocale) => string,
  extra: Omit<SitemapUrlEntry, "loc" | "alternateHrefByLang">,
): SitemapUrlEntry[] {
  const locales = available.filter((loc) => include.includes(loc));
  const alternateHrefByLang = alternateMap(origin, available, hrefFor);
  return locales.map((loc) => ({
    loc: absoluteUrl(origin, hrefFor(loc)),
    alternateHrefByLang,
    ...extra,
  }));
}

function staticPageEntries(origin: string, include: readonly HomeLocale[]): SitemapUrlEntry[] {
  const available = SEO_HOME_LOCALES;
  return [
    ...entriesForPath(origin, include, available, homePageHref, {
      changeFrequency: SITEMAP_CHANGE_FREQ_HOME,
      priority: SITEMAP_PRIORITY_HOME,
    }),
    ...entriesForPath(origin, include, available, aboutPageHref, {
      changeFrequency: SITEMAP_CHANGE_FREQ_SECTION,
      priority: SITEMAP_PRIORITY_SECTION,
    }),
    ...entriesForPath(origin, include, available, contactPageHref, {
      changeFrequency: SITEMAP_CHANGE_FREQ_SECTION,
      priority: SITEMAP_PRIORITY_SECTION,
    }),
    ...entriesForPath(origin, include, available, blogPageHref, {
      changeFrequency: SITEMAP_CHANGE_FREQ_SECTION,
      priority: SITEMAP_PRIORITY_SECTION,
    }),
    ...entriesForPath(origin, include, available, machinesPageHref, {
      changeFrequency: SITEMAP_CHANGE_FREQ_SECTION,
      priority: SITEMAP_PRIORITY_SECTION,
    }),
  ];
}

function categoryEntries(
  origin: string,
  include: readonly HomeLocale[],
  rows: readonly SitemapCategoryRow[],
): SitemapUrlEntry[] {
  return rows.flatMap((row) =>
    entriesForPath(origin, include, row.locales, (loc) => machinesCategoryHref(loc, row.slug), {
      lastModified: row.updatedAt,
      changeFrequency: SITEMAP_CHANGE_FREQ_SECTION,
      priority: SITEMAP_PRIORITY_SECTION,
    }),
  );
}

function machineEntries(
  origin: string,
  include: readonly HomeLocale[],
  rows: readonly SitemapMachineRow[],
): SitemapUrlEntry[] {
  return rows.flatMap((row) =>
    entriesForPath(
      origin,
      include,
      row.locales,
      (loc) => machineDetailHref(loc, row.categorySlug, row.slug),
      {
        lastModified: row.updatedAt,
        changeFrequency: SITEMAP_CHANGE_FREQ_SECTION,
        priority: SITEMAP_PRIORITY_DETAIL,
      },
    ),
  );
}

function blogEntries(
  origin: string,
  include: readonly HomeLocale[],
  rows: readonly SitemapBlogPostRow[],
): SitemapUrlEntry[] {
  return rows.flatMap((row) =>
    entriesForPath(origin, include, row.locales, (loc) => blogPostHref(loc, row.slug), {
      lastModified: row.updatedAt,
      changeFrequency: SITEMAP_CHANGE_FREQ_SECTION,
      priority: SITEMAP_PRIORITY_DETAIL,
    }),
  );
}

async function loadRowsOrEmpty<T>(label: string, load: () => Promise<T[]>): Promise<T[]> {
  try {
    return await load();
  } catch (err) {
    logger.error("sitemap_dynamic_urls_failed", {
      source: label,
      message: err instanceof Error ? err.message : "unknown",
    });
    return [];
  }
}

export async function getSitemapEntries(locale?: HomeLocale): Promise<SitemapUrlEntry[]> {
  const include = locale ? [locale] : [...SEO_HOME_LOCALES];
  const origin = getSiteOrigin();
  const [categories, machines, posts] = await Promise.all([
    loadRowsOrEmpty("categories", findPublishedSitemapCategories),
    loadRowsOrEmpty("machines", findPublishedSitemapMachines),
    loadRowsOrEmpty("blog", findPublishedSitemapBlogPosts),
  ]);
  return [
    ...staticPageEntries(origin, include),
    ...categoryEntries(origin, include, categories),
    ...machineEntries(origin, include, machines),
    ...blogEntries(origin, include, posts),
  ];
}
