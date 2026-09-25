import { NextResponse } from "next/server";

import { requireAdmin } from "@/features/admin/admin.guard";
import { deleteContactMessage, markContactMessageRead } from "@/features/contact/contact.admin.service";
import { adminContactMessageIdParamSchema } from "@/features/contact/contact.schemas";
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

export async function DELETE(request: Request, ctx: RouteContext): Promise<NextResponse> {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { id: rawId } = await ctx.params;
  const idParsed = adminContactMessageIdParamSchema.safeParse({ id: rawId });
  if (!idParsed.success) {
    return jsonError(400, "VALIDATION_ERROR", "Invalid path", {
      fieldErrors: idParsed.error.flatten().fieldErrors,
      formErrors: idParsed.error.flatten().formErrors,
    });
  }

  const removed = await deleteContactMessage(idParsed.data.id);
  if (!removed) {
    return jsonError(404, "NOT_FOUND", "Message not found");
  }
  return NextResponse.json({ data: { ok: true as const } });
}
