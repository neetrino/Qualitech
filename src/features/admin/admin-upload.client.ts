import { ADMIN_API_UPLOAD_PATH } from "@/features/admin/admin.constants";
import { adminApiJson } from "@/features/admin/admin-http.client";
import { R2_ALLOWED_CONTENT_TYPES } from "@/features/admin/r2/r2.constants";

export type R2UploadScopeUi = "blog" | "machines";

const ALLOWED_TYPES = new Set<string>(R2_ALLOWED_CONTENT_TYPES);

type UploadData = {
  publicUrl: string;
  key: string;
  contentType: string;
  byteLength: number;
};

/**
 * Uploads a single image to R2 via the admin API (same-origin; no browser→R2 CORS).
 */
export async function uploadImageToR2(file: File, scope: R2UploadScopeUi): Promise<string> {
  const contentType = file.type;
  if (!ALLOWED_TYPES.has(contentType)) {
    throw new Error(`Use JPEG, PNG, WebP, GIF, or SVG (got: ${contentType || "empty"})`);
  }

  const form = new FormData();
  form.set("scope", scope);
  form.set("file", file);

  const res = await adminApiJson<UploadData>(ADMIN_API_UPLOAD_PATH, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    if (res.error.code === "R2_NOT_CONFIGURED") {
      throw new Error("R2 is not configured on the server.");
    }
    throw new Error(res.error.message);
  }

  return res.data.publicUrl;
}
