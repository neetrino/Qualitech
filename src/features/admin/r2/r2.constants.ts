/** Maximum object size for a single presigned PUT (bytes). */
export const R2_MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** Presigned PUT URL lifetime (seconds). */
export const R2_PRESIGN_EXPIRES_SECONDS = 15 * 60;

export const R2_UPLOAD_SCOPES = ["machines", "blog"] as const;
export type R2UploadScope = (typeof R2_UPLOAD_SCOPES)[number];

/** S3 object key prefix per domain (plan.md: machines / blog). */
export const R2_KEY_PREFIX_BY_SCOPE: Record<R2UploadScope, string> = {
  machines: "machines",
  blog: "blog",
};

export const R2_ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const;

export type R2AllowedContentType = (typeof R2_ALLOWED_CONTENT_TYPES)[number];

export const R2_CONTENT_TYPE_TO_EXTENSION: Record<R2AllowedContentType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};
