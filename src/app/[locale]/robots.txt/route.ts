import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

import { buildRobotsTxt } from "@/features/seo/robots-body";
import { robotsTxtResponse } from "@/features/seo/seo-response";
import { isHomeLocaleSegment } from "@/lib/i18n/locale-routes";
import { getSiteOrigin } from "@/lib/site-origin";

/** Keep in sync with `SEO_REVALIDATE_SEC`. */
export const revalidate = 60;

type RouteContext = { params: Promise<{ locale: string }> };

export async function GET(_request: Request, context: RouteContext): Promise<NextResponse> {
  const { locale: raw } = await context.params;
  if (!isHomeLocaleSegment(raw)) {
    notFound();
  }
  return robotsTxtResponse(buildRobotsTxt(getSiteOrigin(), raw));
}
