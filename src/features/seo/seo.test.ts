import { describe, expect, it } from "vitest";

import { buildRobotsTxt } from "@/features/seo/robots-body";
import { ROBOTS_DISALLOW_ADMIN_PATH } from "@/features/seo/seo.constants";
import { buildSitemapXml, escapeXml } from "@/features/seo/sitemap-xml";
import type { SitemapUrlEntry } from "@/features/seo/seo.types";

describe("escapeXml", () => {
  it("escapes markup and quotes", () => {
    expect(escapeXml(`<a href="x&y">`)).toBe("&lt;a href=&quot;x&amp;y&quot;&gt;");
  });
});

describe("buildRobotsTxt", () => {
  it("includes admin disallow and the root sitemap", () => {
    const body = buildRobotsTxt("https://qualitechmachinery.ru");
    expect(body).toContain(`Disallow: ${ROBOTS_DISALLOW_ADMIN_PATH}`);
    expect(body).toContain("Sitemap: https://qualitechmachinery.ru/sitemap.xml");
    expect(body).not.toContain("/ru/sitemap.xml");
  });

  it("adds a locale sitemap line when locale is set", () => {
    const body = buildRobotsTxt("https://qualitechmachinery.ru", "ru");
    expect(body).toContain("Sitemap: https://qualitechmachinery.ru/ru/sitemap.xml");
  });
});

describe("buildSitemapXml", () => {
  it("renders loc, lastmod, and hreflang alternates", () => {
    const entries: SitemapUrlEntry[] = [
      {
        loc: "https://example.com/ru",
        lastModified: new Date("2026-08-11T06:16:02.000Z"),
        changeFrequency: "daily",
        priority: 0.8,
        alternateHrefByLang: {
          ru: "https://example.com/ru",
          en: "https://example.com/en",
          "x-default": "https://example.com/ru",
        },
      },
    ];
    const xml = buildSitemapXml(entries);
    expect(xml).toContain("<loc>https://example.com/ru</loc>");
    expect(xml).toContain("<lastmod>2026-08-11T06:16:02.000Z</lastmod>");
    expect(xml).toContain('hreflang="x-default"');
    expect(xml).toContain('href="https://example.com/en"');
  });
});
