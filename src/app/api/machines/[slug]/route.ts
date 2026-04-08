import { NextResponse } from "next/server";

import { getMachineBySlugPublic } from "@/features/machines/machines.service";
import { machineDetailQuerySchema, machineSlugParamSchema } from "@/features/machines/machines.schemas";
import { jsonError } from "@/lib/http/api-error";
import { parseSearchParams } from "@/lib/http/parse-search-params";
import { logMetaWithRequest } from "@/lib/http/request-log-meta";
import { logger } from "@/lib/logger";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(request: Request, context: RouteContext): Promise<NextResponse> {
  const { slug: rawSlug } = await context.params;
  const slugParsed = machineSlugParamSchema.safeParse({ slug: rawSlug });
  if (!slugParsed.success) {
    return jsonError(400, "VALIDATION_ERROR", "Invalid path", {
      fieldErrors: slugParsed.error.flatten().fieldErrors,
      formErrors: slugParsed.error.flatten().formErrors,
    });
  }

  const { searchParams } = new URL(request.url);
  const queryParsed = parseSearchParams(machineDetailQuerySchema, searchParams);
  if (!queryParsed.ok) {
    return queryParsed.response;
  }

  try {
    const data = await getMachineBySlugPublic(slugParsed.data.slug, queryParsed.data.locale);
    if (!data) {
      return jsonError(404, "NOT_FOUND", "Machine not found");
    }
    return NextResponse.json({ data });
  } catch (err) {
    logger.error(
      "machine_detail_failed",
      logMetaWithRequest(request, {
        message: err instanceof Error ? err.message : "unknown",
      }),
    );
    return jsonError(500, "INTERNAL_ERROR", "Unexpected error");
  }
}
