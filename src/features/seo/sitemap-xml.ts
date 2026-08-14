import type { SitemapUrlEntry } from "@/features/seo/seo.types";

export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function xhtmlLink(hreflang: string, href: string): string {
  return `    <xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}"/>`;
}

function urlBlock(entry: SitemapUrlEntry): string {
  const lines = ["  <url>", `    <loc>${escapeXml(entry.loc)}</loc>`];
  if (entry.lastModified) {
    lines.push(`    <lastmod>${escapeXml(entry.lastModified.toISOString())}</lastmod>`);
  }
  lines.push(`    <changefreq>${entry.changeFrequency}</changefreq>`);
  lines.push(`    <priority>${entry.priority.toFixed(4)}</priority>`);
  for (const [lang, href] of Object.entries(entry.alternateHrefByLang)) {
    if (href) {
      lines.push(xhtmlLink(lang, href));
    }
  }
  lines.push("  </url>");
  return lines.join("\n");
}

export function buildSitemapXml(entries: readonly SitemapUrlEntry[]): string {
  const body = entries.map(urlBlock).join("\n");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    body,
    "</urlset>",
    "",
  ].join("\n");
}
