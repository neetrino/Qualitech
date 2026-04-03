import { NextResponse } from "next/server";

import { requireAdmin } from "@/features/admin/admin.guard";
import { adminBlogCreateSchema } from "@/features/blog/blog.admin.schemas";
import { createBlogPostForAdmin, listBlogPostsForAdmin } from "@/features/blog/blog.admin.service";
import { jsonError } from "@/lib/http/api-error";
import { parseJsonBody } from "@/lib/http/parse-json-body";
import { logMetaWithRequest } from "@/lib/http/request-log-meta";
import { logger } from "@/lib/logger";
import { isPrismaUniqueConstraintError } from "@/lib/prisma-errors";

export async function GET(request: Request): Promise<NextResponse> {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }
  const data = await listBlogPostsForAdmin();
  return NextResponse.json({ data });
}

export async function POST(request: Request): Promise<NextResponse> {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  const parsed = await parseJsonBody(request, adminBlogCreateSchema);
  if (!parsed.ok) {
    return parsed.response;
  }

  try {
    const row = await createBlogPostForAdmin(parsed.data);
    return NextResponse.json({ data: row }, { status: 201 });
  } catch (err) {
    if (isPrismaUniqueConstraintError(err)) {
      return jsonError(409, "CONFLICT", "Slug or unique constraint violation");
    }
    logger.error(
      "admin_blog_create_failed",
      logMetaWithRequest(request, {
        message: err instanceof Error ? err.message : "unknown",
      }),
    );
    return jsonError(500, "INTERNAL_ERROR", "Unexpected error");
  }
}
