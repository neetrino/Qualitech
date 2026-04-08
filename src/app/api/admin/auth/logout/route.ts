import { NextResponse } from "next/server";

import { buildAdminSessionClearCookie } from "@/features/admin/admin.cookies";

export async function POST(): Promise<NextResponse> {
  const res = NextResponse.json({ data: { ok: true as const } });
  res.headers.append("Set-Cookie", buildAdminSessionClearCookie());
  return res;
}
