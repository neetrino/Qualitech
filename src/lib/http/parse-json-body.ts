import type { NextResponse } from "next/server";
import type { z } from "zod";

import { jsonError } from "@/lib/http/api-error";

export type ParseJsonResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: NextResponse };

export async function parseJsonBody<T extends z.ZodTypeAny>(
  request: Request,
  schema: T,
): Promise<ParseJsonResult<z.infer<T>>> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return {
      ok: false,
      response: jsonError(400, "VALIDATION_ERROR", "Invalid JSON body"),
    };
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      response: jsonError(400, "VALIDATION_ERROR", "Invalid request body", {
        fieldErrors: parsed.error.flatten().fieldErrors,
        formErrors: parsed.error.flatten().formErrors,
      }),
    };
  }
  return { ok: true, data: parsed.data };
}
