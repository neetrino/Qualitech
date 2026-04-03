/** httpOnly session cookie; Path limits scope to admin API routes. */
export const ADMIN_SESSION_COOKIE_NAME = "qualitech_admin";

export const ADMIN_JWT_ISSUER = "qualitech-admin";

/** Fallback when `JWT_EXPIRES_IN` is missing or unparsable. */
export const ADMIN_SESSION_DEFAULT_MAX_AGE_SEC = 7 * 24 * 60 * 60;
