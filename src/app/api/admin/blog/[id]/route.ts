import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { requireAdmin } from "@/features/admin/admin.guard";
import { adminBlogIdParamSchema, adminBlogPatchSchema } from "@/features/blog/blog.admin.schemas";
import {
  deleteBlogPostForAdmin,
  getBlogPostForAdmin,
  updateBlogPostForAdmin,
} from "@/features/blog/blog.admin.service";
import { jsonError } from "@/lib/http/api-error";
import { parseJsonBody } from "@/lib/http/parse-json-body";
import { logMetaWithRequest } from "@/lib/http/request-log-meta";
import { logger } from "@/lib/logger";
import { isPrismaUniqueConstraintError } from "@/lib/prisma-errors";
import { BLOG_PUBLIC_CACHE_TAG } from "@/features/blog/blog.constants";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext): Promise<NextResponse> {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { id: rawId } = await context.params;
  const idParsed = adminBlogIdParamSchema.safeParse({ id: rawId });
  if (!idParsed.success) {
    return jsonError(400, "VALIDATION_ERROR", "Invalid path", {
      fieldErrors: idParsed.error.flatten().fieldErrors,
      formErrors: idParsed.error.flatten().formErrors,
    });
  }

  const row = await getBlogPostForAdmin(idParsed.data.id);
  if (!row) {
    return jsonError(404, "NOT_FOUND", "Blog post not found");
  }
  return NextResponse.json({ data: row });
}

export async function PATCH(request: Request, context: RouteContext): Promise<NextResponse> {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { id: rawId } = await context.params;
  const idParsed = adminBlogIdParamSchema.safeParse({ id: rawId });
  if (!idParsed.success) {
    return jsonError(400, "VALIDATION_ERROR", "Invalid path", {
      fieldErrors: idParsed.error.flatten().fieldErrors,
      formErrors: idParsed.error.flatten().formErrors,
    });
  }

  const parsed = await parseJsonBody(request, adminBlogPatchSchema);
  if (!parsed.ok) {
    return parsed.response;
  }

  try {
    const row = await updateBlogPostForAdmin(idParsed.data.id, parsed.data);
    if (!row) {
      return jsonError(404, "NOT_FOUND", "Blog post not found");
    }
    revalidateTag(BLOG_PUBLIC_CACHE_TAG);
    return NextResponse.json({ data: row });
  } catch (err) {
    if (isPrismaUniqueConstraintError(err)) {
      return jsonError(409, "CONFLICT", "Slug or unique constraint violation");
    }
    logger.error(
      "admin_blog_patch_failed",
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
  const idParsed = adminBlogIdParamSchema.safeParse({ id: rawId });
  if (!idParsed.success) {
    return jsonError(400, "VALIDATION_ERROR", "Invalid path", {
      fieldErrors: idParsed.error.flatten().fieldErrors,
      formErrors: idParsed.error.flatten().formErrors,
    });
  }

  const removed = await deleteBlogPostForAdmin(idParsed.data.id);
  if (!removed) {
    return jsonError(404, "NOT_FOUND", "Blog post not found");
  }
  revalidateTag(BLOG_PUBLIC_CACHE_TAG);
  return NextResponse.json({ data: { ok: true as const } });
}
