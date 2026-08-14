import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

import { seoRouteErrorMeta } from "@/features/seo/seo-route-error";
import { sitemapXmlResponse } from "@/features/seo/seo-response";
import { getSitemapEntries } from "@/features/seo/sitemap.service";
import { buildSitemapXml } from "@/features/seo/sitemap-xml";
import { isHomeLocaleSegment } from "@/lib/i18n/locale-routes";
import { logger } from "@/lib/logger";

/** Keep in sync with `SEO_REVALIDATE_SEC`. */
export const revalidate = 60;

type RouteContext = { params: Promise<{ locale: string }> };

export async function GET(request: Request, context: RouteContext): Promise<NextResponse> {
  const { locale: raw } = await context.params;
  if (!isHomeLocaleSegment(raw)) {
    notFound();
  }
  try {
    const entries = await getSitemapEntries(raw);
    return sitemapXmlResponse(buildSitemapXml(entries));
  } catch (err) {
    logger.error("locale_sitemap_xml_failed", seoRouteErrorMeta(request, err));
    return new NextResponse("Sitemap unavailable", { status: 500 });
  }
}
