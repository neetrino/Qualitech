export type AdminApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

type ApiEnvelope<T> = { data: T };

type RawErrorBody = { error?: AdminApiError };

function mergeHeaders(base: Headers, extra?: HeadersInit): Headers {
  const out = new Headers(base);
  if (extra) {
    const h = new Headers(extra);
    h.forEach((v, k) => out.set(k, v));
  }
  return out;
}

/**
 * Calls admin JSON API with credentials. Sets `Content-Type` only when a body is sent.
 */
export async function adminApiJson<T>(
  path: string,
  init: RequestInit = {},
): Promise<
  { ok: true; status: number; data: T } | { ok: false; status: number; error: AdminApiError }
> {
  const hasBody = init.body !== undefined && init.body !== null;
  const isFormData =
    typeof FormData !== "undefined" && init.body instanceof FormData;
  const headers = mergeHeaders(new Headers(), init.headers);
  if (hasBody && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(path, { ...init, credentials: "include", headers });
  let raw: unknown;
  try {
    raw = await res.json();
  } catch {
    raw = {};
  }

  if (!res.ok) {
    const errBody = raw as RawErrorBody;
    const error: AdminApiError = errBody.error ?? {
      code: "UNKNOWN",
      message: res.statusText || "Request failed",
    };
    return { ok: false, status: res.status, error };
  }

  const envelope = raw as ApiEnvelope<T>;
  return { ok: true, status: res.status, data: envelope.data };
}

export function formatAdminValidationError(error: AdminApiError): string {
  const d = error.details;
  if (!d || typeof d !== "object") {
    return error.message;
  }
  const fe = d.fieldErrors as Record<string, string[] | undefined> | undefined;
  if (!fe) {
    return error.message;
  }
  const parts = Object.entries(fe)
    .flatMap(([k, v]) => (Array.isArray(v) ? v.map((m) => `${k}: ${m}`) : []))
    .slice(0, 6);
  return parts.length > 0 ? parts.join(" · ") : error.message;
}
