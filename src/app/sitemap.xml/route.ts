import { NextResponse } from "next/server";

import { seoRouteErrorMeta } from "@/features/seo/seo-route-error";
import { sitemapXmlResponse } from "@/features/seo/seo-response";
import { getSitemapEntries } from "@/features/seo/sitemap.service";
import { buildSitemapXml } from "@/features/seo/sitemap-xml";
import { logger } from "@/lib/logger";

/** Keep in sync with `SEO_REVALIDATE_SEC`. */
export const revalidate = 60;

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const entries = await getSitemapEntries();
    return sitemapXmlResponse(buildSitemapXml(entries));
  } catch (err) {
    logger.error("sitemap_xml_failed", seoRouteErrorMeta(request, err));
    return new NextResponse("Sitemap unavailable", { status: 500 });
  }
}
