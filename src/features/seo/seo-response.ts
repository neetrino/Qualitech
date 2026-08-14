import { NextResponse } from "next/server";

import {
  ROBOTS_CONTENT_TYPE,
  SEO_REVALIDATE_SEC,
  XML_CONTENT_TYPE,
} from "@/features/seo/seo.constants";

const CACHE_CONTROL = `public, max-age=${SEO_REVALIDATE_SEC}, s-maxage=${SEO_REVALIDATE_SEC}`;

export function sitemapXmlResponse(xml: string): NextResponse {
  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": XML_CONTENT_TYPE,
      "Cache-Control": CACHE_CONTROL,
    },
  });
}

export function robotsTxtResponse(body: string): NextResponse {
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": ROBOTS_CONTENT_TYPE,
      "Cache-Control": CACHE_CONTROL,
    },
  });
}
