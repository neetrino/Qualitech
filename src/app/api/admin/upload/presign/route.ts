import { NextResponse } from "next/server";

import { requireAdmin } from "@/features/admin/admin.guard";
import { getR2ConfigOrNull } from "@/features/admin/r2/r2.config";
import { createPresignedR2Upload } from "@/features/admin/r2/r2.presign.service";
import { adminPresignUploadBodySchema } from "@/features/admin/r2/r2.schemas";
import { jsonError } from "@/lib/http/api-error";
import { parseJsonBody } from "@/lib/http/parse-json-body";
import { logMetaWithRequest } from "@/lib/http/request-log-meta";
import { logger } from "@/lib/logger";

export async function POST(request: Request): Promise<NextResponse> {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  const config = getR2ConfigOrNull();
  if (!config) {
    return jsonError(503, "R2_NOT_CONFIGURED", "Object storage is not configured");
  }

  const parsed = await parseJsonBody(request, adminPresignUploadBodySchema);
  if (!parsed.ok) {
    return parsed.response;
  }

  try {
    const signed = await createPresignedR2Upload(config, parsed.data);
    return NextResponse.json({
      data: {
        ...signed,
        contentType: parsed.data.contentType,
        byteLength: parsed.data.byteLength,
      },
    });
  } catch (err) {
    logger.error(
      "admin_r2_presign_failed",
      logMetaWithRequest(request, {
        message: err instanceof Error ? err.message : "unknown",
      }),
    );
    return jsonError(500, "INTERNAL_ERROR", "Could not create upload URL");
  }
}
