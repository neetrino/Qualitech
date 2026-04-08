import { NextResponse } from "next/server";

import { listMachinesPublic } from "@/features/machines/machines.service";
import { machinesListQuerySchema } from "@/features/machines/machines.schemas";
import { jsonError } from "@/lib/http/api-error";
import { parseSearchParams } from "@/lib/http/parse-search-params";
import { logMetaWithRequest } from "@/lib/http/request-log-meta";
import { logger } from "@/lib/logger";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const parsed = parseSearchParams(machinesListQuerySchema, searchParams);
  if (!parsed.ok) {
    return parsed.response;
  }
  try {
    const result = await listMachinesPublic(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    logger.error(
      "machines_list_failed",
      logMetaWithRequest(request, {
        message: err instanceof Error ? err.message : "unknown",
      }),
    );
    return jsonError(500, "INTERNAL_ERROR", "Unexpected error");
  }
}
