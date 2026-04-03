import { NextResponse } from "next/server";

import { listBlogPostsPublic } from "@/features/blog/blog.service";
import { blogListQuerySchema } from "@/features/blog/blog.schemas";
import { jsonError } from "@/lib/http/api-error";
import { parseSearchParams } from "@/lib/http/parse-search-params";
import { logMetaWithRequest } from "@/lib/http/request-log-meta";
import { logger } from "@/lib/logger";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const parsed = parseSearchParams(blogListQuerySchema, searchParams);
  if (!parsed.ok) {
    return parsed.response;
  }
  try {
    const result = await listBlogPostsPublic(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    logger.error(
      "blog_list_failed",
      logMetaWithRequest(request, {
        message: err instanceof Error ? err.message : "unknown",
      }),
    );
    return jsonError(500, "INTERNAL_ERROR", "Unexpected error");
  }
}
