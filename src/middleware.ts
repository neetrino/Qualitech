import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { REQUEST_ID_HEADER } from "@/lib/http/request-log-meta";
import { HOME_LOCALE_COOKIE_NAME } from "@/lib/i18n/home-locale.constants";

const LOCALE_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 365;

export function middleware(request: NextRequest): NextResponse {
  const path = request.nextUrl.pathname;

  if (path === "/") {
    const raw = request.cookies.get(HOME_LOCALE_COOKIE_NAME)?.value;
    const loc = raw === "en" || raw === "ru" ? raw : "ru";
    const url = request.nextUrl.clone();
    url.pathname = `/${loc}`;
    return NextResponse.redirect(url);
  }

  if (path === "/contact") {
    const raw = request.cookies.get(HOME_LOCALE_COOKIE_NAME)?.value;
    const loc = raw === "en" || raw === "ru" ? raw : "ru";
    const url = request.nextUrl.clone();
    url.pathname = `/${loc}/contact`;
    return NextResponse.redirect(url);
  }

  if (path === "/about") {
    const raw = request.cookies.get(HOME_LOCALE_COOKIE_NAME)?.value;
    const loc = raw === "en" || raw === "ru" ? raw : "ru";
    const url = request.nextUrl.clone();
    url.pathname = `/${loc}/about`;
    return NextResponse.redirect(url);
  }

  const localized = path.match(/^\/(en|ru)(\/(contact|about))?$/);
  if (localized) {
    const loc = localized[1];
    const res = NextResponse.next();
    res.cookies.set(HOME_LOCALE_COOKIE_NAME, loc, {
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE_SEC,
      sameSite: "lax",
    });
    return res;
  }

  const localizedMachines = path.match(/^\/(en|ru)\/machines(?:\/.*)?$/);
  if (localizedMachines) {
    const loc = localizedMachines[1];
    const res = NextResponse.next();
    res.cookies.set(HOME_LOCALE_COOKIE_NAME, loc, {
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE_SEC,
      sameSite: "lax",
    });
    return res;
  }

  if (!path.startsWith("/api")) {
    return NextResponse.next();
  }

  const incoming = request.headers.get(REQUEST_ID_HEADER)?.trim();
  const requestId = incoming && incoming.length > 0 ? incoming : crypto.randomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(REQUEST_ID_HEADER, requestId);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set(REQUEST_ID_HEADER, requestId);
  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/",
    "/contact",
    "/about",
    "/en",
    "/ru",
    "/en/contact",
    "/ru/contact",
    "/en/about",
    "/ru/about",
    "/en/machines/:path*",
    "/ru/machines/:path*",
  ],
};
