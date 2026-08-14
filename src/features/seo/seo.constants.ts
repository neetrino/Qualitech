import type { HomeLocale } from "@/features/home/home.messages";

export const SEO_HOME_LOCALES = ["ru", "en"] as const satisfies readonly HomeLocale[];

export const SEO_DEFAULT_LOCALE: HomeLocale = "ru";

/** Keep in sync with `export const revalidate` on SEO route handlers. */
export const SEO_REVALIDATE_SEC = 60;

export const SITEMAP_PRIORITY_HOME = 0.8;
export const SITEMAP_PRIORITY_SECTION = 0.64;
export const SITEMAP_PRIORITY_DETAIL = 0.512;

export const SITEMAP_CHANGE_FREQ_HOME = "daily" as const;
export const SITEMAP_CHANGE_FREQ_SECTION = "weekly" as const;

export const ROBOTS_DISALLOW_ADMIN_PATH = "/admin";

export const XML_CONTENT_TYPE = "application/xml; charset=utf-8";
export const ROBOTS_CONTENT_TYPE = "text/plain; charset=utf-8";
