import { NextResponse } from "next/server";

import { requireAdmin } from "@/features/admin/admin.guard";
import {
  adminMachineCategoryIdParamSchema,
  adminMachineCategoryPatchSchema,
} from "@/features/machines/machines.admin-category.schemas";
import {
  deleteMachineCategoryForAdmin,
  getMachineCategoryForAdmin,
  updateMachineCategoryForAdmin,
} from "@/features/machines/machines.admin-category.service";
import { revalidateMachineCategoryPublicCaches } from "@/features/machines/machines.public-cache.revalidate";
import { jsonError } from "@/lib/http/api-error";
import { parseJsonBody } from "@/lib/http/parse-json-body";
import { logMetaWithRequest } from "@/lib/http/request-log-meta";
import { logger } from "@/lib/logger";
import { isPrismaUniqueConstraintError } from "@/lib/prisma-errors";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext): Promise<NextResponse> {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { id: rawId } = await context.params;
  const idParsed = adminMachineCategoryIdParamSchema.safeParse({ id: rawId });
  if (!idParsed.success) {
    return jsonError(400, "VALIDATION_ERROR", "Invalid path", {
      fieldErrors: idParsed.error.flatten().fieldErrors,
      formErrors: idParsed.error.flatten().formErrors,
    });
  }

  const row = await getMachineCategoryForAdmin(idParsed.data.id);
  if (!row) {
    return jsonError(404, "NOT_FOUND", "Category not found");
  }
  return NextResponse.json({ data: row });
}

export async function PATCH(request: Request, context: RouteContext): Promise<NextResponse> {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { id: rawId } = await context.params;
  const idParsed = adminMachineCategoryIdParamSchema.safeParse({ id: rawId });
  if (!idParsed.success) {
    return jsonError(400, "VALIDATION_ERROR", "Invalid path", {
      fieldErrors: idParsed.error.flatten().fieldErrors,
      formErrors: idParsed.error.flatten().formErrors,
    });
  }

  const parsed = await parseJsonBody(request, adminMachineCategoryPatchSchema);
  if (!parsed.ok) {
    return parsed.response;
  }

  try {
    const row = await updateMachineCategoryForAdmin(idParsed.data.id, parsed.data);
    if (!row) {
      return jsonError(404, "NOT_FOUND", "Category not found");
    }
    revalidateMachineCategoryPublicCaches();
    return NextResponse.json({ data: row });
  } catch (err) {
    if (isPrismaUniqueConstraintError(err)) {
      return jsonError(409, "CONFLICT", "Slug or unique constraint violation");
    }
    logger.error(
      "admin_machine_category_patch_failed",
      logMetaWithRequest(request, {
        message: err instanceof Error ? err.message : "unknown",
      }),
    );
    return jsonError(500, "INTERNAL_ERROR", "Unexpected error");
  }
}

export async function DELETE(request: Request, context: RouteContext): Promise<NextResponse> {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { id: rawId } = await context.params;
  const idParsed = adminMachineCategoryIdParamSchema.safeParse({ id: rawId });
  if (!idParsed.success) {
    return jsonError(400, "VALIDATION_ERROR", "Invalid path", {
      fieldErrors: idParsed.error.flatten().fieldErrors,
      formErrors: idParsed.error.flatten().formErrors,
    });
  }

  const result = await deleteMachineCategoryForAdmin(idParsed.data.id);
  if (!result.ok) {
    if (result.reason === "NOT_FOUND") {
      return jsonError(404, "NOT_FOUND", "Category not found");
    }
    if (result.reason === "HAS_CHILDREN") {
      return jsonError(409, "CONFLICT", "Category has subcategories; remove them first");
    }
    return jsonError(409, "CONFLICT", "Category still has products; reassign or delete them first");
  }
  revalidateMachineCategoryPublicCaches();
  return NextResponse.json({ data: { ok: true as const } });
}
