import { ADMIN_SESSION_COOKIE_NAME } from "@/features/admin/admin.constants";

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function readCookieFromRequest(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) {
    return undefined;
  }
  const segments = header.split(";");
  for (const segment of segments) {
    const trimmed = segment.trim();
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    if (key !== name) {
      continue;
    }
    const rawValue = trimmed.slice(eq + 1);
    try {
      return decodeURIComponent(rawValue);
    } catch {
      return rawValue;
    }
  }
  return undefined;
}

export function buildAdminSessionSetCookie(token: string, maxAgeSec: number): string {
  const parts = [
    `${ADMIN_SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/api/admin",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSec}`,
  ];
  if (isProduction()) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export function buildAdminSessionClearCookie(): string {
  const parts = [
    `${ADMIN_SESSION_COOKIE_NAME}=`,
    "Path=/api/admin",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (isProduction()) {
    parts.push("Secure");
  }
  return parts.join("; ");
}
