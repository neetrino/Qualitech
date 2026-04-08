import { NextResponse } from "next/server";

import { submitContactMessage } from "@/features/contact/contact.service";
import {
  contactIdempotencyKeyHeaderSchema,
  contactSubmitBodySchema,
} from "@/features/contact/contact.schemas";
import { jsonError } from "@/lib/http/api-error";
import { parseJsonBody } from "@/lib/http/parse-json-body";
import { logMetaWithRequest } from "@/lib/http/request-log-meta";
import { logger } from "@/lib/logger";

const IDEMPOTENCY_HEADER = "idempotency-key";

export async function POST(request: Request): Promise<NextResponse> {
  const parsedBody = await parseJsonBody(request, contactSubmitBodySchema);
  if (!parsedBody.ok) {
    return parsedBody.response;
  }

  const rawKey = request.headers.get(IDEMPOTENCY_HEADER);
  const keyParsed = contactIdempotencyKeyHeaderSchema.safeParse(
    rawKey === null || rawKey === "" ? undefined : rawKey,
  );
  if (!keyParsed.success) {
    return jsonError(400, "VALIDATION_ERROR", `Invalid ${IDEMPOTENCY_HEADER} header`, {
      fieldErrors: keyParsed.error.flatten().fieldErrors,
      formErrors: keyParsed.error.flatten().formErrors,
    });
  }

  try {
    const outcome = await submitContactMessage(request, parsedBody.data, keyParsed.data);
    if (!outcome.ok) {
      const { error } = outcome;
      return jsonError(error.status, error.code, error.message, error.details);
    }
    return NextResponse.json({ data: outcome.data });
  } catch (err) {
    logger.error(
      "contact_submit_failed",
      logMetaWithRequest(request, {
        message: err instanceof Error ? err.message : "unknown",
      }),
    );
    return jsonError(500, "INTERNAL_ERROR", "Unexpected error");
  }
}
