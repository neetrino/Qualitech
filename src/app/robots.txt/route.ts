import { NextResponse } from "next/server";

import { buildRobotsTxt } from "@/features/seo/robots-body";
import { robotsTxtResponse } from "@/features/seo/seo-response";
import { getSiteOrigin } from "@/lib/site-origin";

/** Keep in sync with `SEO_REVALIDATE_SEC`. */
export const revalidate = 60;

export function GET(): NextResponse {
  return robotsTxtResponse(buildRobotsTxt(getSiteOrigin()));
}
