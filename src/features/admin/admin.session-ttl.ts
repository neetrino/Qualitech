import { ADMIN_SESSION_DEFAULT_MAX_AGE_SEC } from "@/features/admin/admin.constants";

/**
 * Parses values like `7d`, `12h`, `30m`, `900s` for cookie Max-Age alignment with JWT exp.
 */
export function jwtExpiresInToSeconds(raw: string | undefined): number {
  const value = raw?.trim();
  if (!value) {
    return ADMIN_SESSION_DEFAULT_MAX_AGE_SEC;
  }
  const match = /^(\d+)([dhms])$/i.exec(value);
  if (!match) {
    return ADMIN_SESSION_DEFAULT_MAX_AGE_SEC;
  }
  const n = Number(match[1]);
  const unit = match[2].toLowerCase();
  if (unit === "d") {
    return n * 86_400;
  }
  if (unit === "h") {
    return n * 3600;
  }
  if (unit === "m") {
    return n * 60;
  }
  return n;
}
