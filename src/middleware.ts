import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { REQUEST_ID_HEADER } from "@/lib/http/request-log-meta";

export function middleware(request: NextRequest): NextResponse {
  const incoming = request.headers.get(REQUEST_ID_HEADER)?.trim();
  const requestId = incoming && incoming.length > 0 ? incoming : crypto.randomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(REQUEST_ID_HEADER, requestId);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set(REQUEST_ID_HEADER, requestId);
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
