import { NextResponse } from "next/server";

import { requireAdmin } from "@/features/admin/admin.guard";

export async function GET(request: Request): Promise<NextResponse> {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }
  return NextResponse.json({ data: { admin: auth.admin } });
}
