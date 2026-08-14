import { logMetaWithRequest } from "@/lib/http/request-log-meta";

export function seoRouteErrorMeta(request: Request, err: unknown): Record<string, unknown> {
  return logMetaWithRequest(request, {
    message: err instanceof Error ? err.message : "unknown",
  });
}
