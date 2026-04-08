/** httpOnly session cookie; Path limits scope to admin API routes. */
export const ADMIN_SESSION_COOKIE_NAME = "qualitech_admin";

export const ADMIN_JWT_ISSUER = "qualitech-admin";

/** Fallback when `JWT_EXPIRES_IN` is missing or unparsable. */
export const ADMIN_SESSION_DEFAULT_MAX_AGE_SEC = 7 * 24 * 60 * 60;

/** Browser `fetch` targets (session cookie scope: `/api/admin`). */
export const ADMIN_API_AUTH_ME_PATH = "/api/admin/auth/me";
export const ADMIN_API_AUTH_LOGIN_PATH = "/api/admin/auth/login";
export const ADMIN_API_AUTH_LOGOUT_PATH = "/api/admin/auth/logout";

export const ADMIN_API_BLOG_PATH = "/api/admin/blog";
export const ADMIN_API_MACHINES_PATH = "/api/admin/machines";
export const ADMIN_API_MACHINE_CATEGORIES_PATH = "/api/admin/machine-categories";
export const ADMIN_API_MESSAGES_PATH = "/api/admin/messages";
export const ADMIN_API_UPLOAD_PATH = "/api/admin/upload";
export const ADMIN_API_UPLOAD_PRESIGN_PATH = "/api/admin/upload/presign";
