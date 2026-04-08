import type { NextResponse } from "next/server";
import type { z } from "zod";

import { jsonError } from "@/lib/http/api-error";

export type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: NextResponse };

export function parseSearchParams<T extends z.ZodTypeAny>(
  schema: T,
  searchParams: URLSearchParams,
): ParseResult<z.infer<T>> {
  const record = Object.fromEntries(searchParams.entries());
  const parsed = schema.safeParse(record);
  if (!parsed.success) {
    return {
      ok: false,
      response: jsonError(400, "VALIDATION_ERROR", "Invalid query parameters", {
        fieldErrors: parsed.error.flatten().fieldErrors,
        formErrors: parsed.error.flatten().formErrors,
      }),
    };
  }
  return { ok: true, data: parsed.data };
}
