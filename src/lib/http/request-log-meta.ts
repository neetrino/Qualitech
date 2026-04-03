/** Lowercase header used by middleware and log correlation (W3C-ish tracing). */
export const REQUEST_ID_HEADER = "x-request-id" as const;

export function getRequestId(request: Request): string | undefined {
  const raw = request.headers.get(REQUEST_ID_HEADER)?.trim();
  return raw && raw.length > 0 ? raw : undefined;
}

/** Merges `requestId` from the incoming request when middleware (or client) set it. */
export function logMetaWithRequest(request: Request, meta: Record<string, unknown> = {}): Record<string, unknown> {
  const requestId = getRequestId(request);
  return requestId === undefined ? { ...meta } : { ...meta, requestId };
}
