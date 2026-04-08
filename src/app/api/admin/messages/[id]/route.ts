import { NextResponse } from "next/server";

import { requireAdmin } from "@/features/admin/admin.guard";
import { markContactMessageRead } from "@/features/contact/contact.admin.service";
import { jsonError } from "@/lib/http/api-error";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: RouteContext): Promise<NextResponse> {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await ctx.params;
  const updated = await markContactMessageRead(id);
  if (!updated) {
    return jsonError(404, "NOT_FOUND", "Message not found");
  }
  return NextResponse.json({ data: updated });
}
