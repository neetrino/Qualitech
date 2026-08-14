import { ROBOTS_DISALLOW_ADMIN_PATH } from "@/features/seo/seo.constants";

function sitemapLine(origin: string, localePath: string | null): string {
  const suffix = localePath === null ? "/sitemap.xml" : `/${localePath}/sitemap.xml`;
  return `Sitemap: ${origin}${suffix}`;
}

/** robots.txt body. `locale` adds a locale sitemap line in addition to the root sitemap. */
export function buildRobotsTxt(origin: string, locale?: string): string {
  const sitemapLines = [sitemapLine(origin, null)];
  if (locale) {
    sitemapLines.push(sitemapLine(origin, locale));
  }
  return [
    "User-agent: *",
    "Allow: /",
    `Disallow: ${ROBOTS_DISALLOW_ADMIN_PATH}`,
    "",
    "User-agent: Googlebot",
    "Allow: /",
    `Disallow: ${ROBOTS_DISALLOW_ADMIN_PATH}`,
    "",
    "User-agent: Yandex",
    "Allow: /",
    `Disallow: ${ROBOTS_DISALLOW_ADMIN_PATH}`,
    "",
    ...sitemapLines,
    "",
  ].join("\n");
}
