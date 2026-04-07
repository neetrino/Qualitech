import { NextResponse } from "next/server";

import { requireAdmin } from "@/features/admin/admin.guard";
import { getR2ConfigOrNull } from "@/features/admin/r2/r2.config";
import { R2_MAX_UPLOAD_BYTES } from "@/features/admin/r2/r2.constants";
import { putR2ObjectFromServer } from "@/features/admin/r2/r2.presign.service";
import { adminPresignUploadBodySchema } from "@/features/admin/r2/r2.schemas";
import { jsonError } from "@/lib/http/api-error";
import { logMetaWithRequest } from "@/lib/http/request-log-meta";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

function isR2UploadScope(v: unknown): v is "blog" | "machines" {
  return v === "blog" || v === "machines";
}

export async function POST(request: Request): Promise<NextResponse> {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  const config = getR2ConfigOrNull();
  if (!config) {
    return jsonError(503, "R2_NOT_CONFIGURED", "Object storage is not configured");
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError(400, "BAD_REQUEST", "Expected multipart form data");
  }

  const scopeRaw = form.get("scope");
  const file = form.get("file");
  if (!isR2UploadScope(scopeRaw)) {
    return jsonError(400, "VALIDATION_ERROR", "Invalid or missing scope", {
      fieldErrors: { scope: ["Expected blog or machines"] },
    });
  }
  if (!(file instanceof File)) {
    return jsonError(400, "VALIDATION_ERROR", "Missing file", {
      fieldErrors: { file: ["Expected a file"] },
    });
  }

  const contentType = file.type;
  const byteLength = file.size;
  const parsed = adminPresignUploadBodySchema.safeParse({
    scope: scopeRaw,
    contentType,
    byteLength,
  });
  if (!parsed.success) {
    return jsonError(400, "VALIDATION_ERROR", "Invalid upload", {
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }
  if (byteLength > R2_MAX_UPLOAD_BYTES) {
    return jsonError(413, "PAYLOAD_TOO_LARGE", `Max ${R2_MAX_UPLOAD_BYTES} bytes`);
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(await file.arrayBuffer());
  } catch (err) {
    logger.error(
      "admin_r2_upload_read_failed",
      logMetaWithRequest(request, {
        message: err instanceof Error ? err.message : "unknown",
      }),
    );
    return jsonError(500, "INTERNAL_ERROR", "Could not read upload");
  }

  if (buffer.length !== byteLength) {
    return jsonError(400, "VALIDATION_ERROR", "File size mismatch");
  }

  try {
    const uploaded = await putR2ObjectFromServer(config, parsed.data, buffer);
    return NextResponse.json({
      data: {
        publicUrl: uploaded.publicUrl,
        key: uploaded.key,
        contentType: parsed.data.contentType,
        byteLength: parsed.data.byteLength,
      },
    });
  } catch (err) {
    logger.error(
      "admin_r2_upload_failed",
      logMetaWithRequest(request, {
        message: err instanceof Error ? err.message : "unknown",
      }),
    );
    return jsonError(500, "INTERNAL_ERROR", "Could not store file");
  }
}
