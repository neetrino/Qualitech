import { ADMIN_API_UPLOAD_PATH } from "@/features/admin/admin.constants";
import { adminApiJson } from "@/features/admin/admin-http.client";
import { R2_IMAGE_CONTENT_TYPES } from "@/features/admin/r2/r2.constants";

export type R2UploadScopeUi = "blog" | "machines";

const IMAGE_UPLOAD_TYPES = new Set<string>(R2_IMAGE_CONTENT_TYPES);

const PDF_CONTENT_TYPE = "application/pdf" as const;

const SPREADSHEET_XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" as const;
const SPREADSHEET_XLS = "application/vnd.ms-excel" as const;
const SPREADSHEET_TYPES = new Set<string>([SPREADSHEET_XLSX, SPREADSHEET_XLS]);

type UploadData = {
  publicUrl: string;
  key: string;
  contentType: string;
  byteLength: number;
};

/** Shared multipart POST to `/api/admin/upload`. */
async function postMultipartUpload(file: File, scope: R2UploadScopeUi): Promise<string> {
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

/**
 * Uploads a single image to R2 via the admin API (same-origin; no browser→R2 CORS).
 */
export async function uploadImageToR2(file: File, scope: R2UploadScopeUi): Promise<string> {
  const contentType = file.type;
  if (!IMAGE_UPLOAD_TYPES.has(contentType)) {
    throw new Error(`Use JPEG, PNG, WebP, GIF, or SVG (got: ${contentType || "empty"})`);
  }
  return postMultipartUpload(file, scope);
}

/** PDF brochure / datasheet upload (same R2 flow as images). */
export async function uploadPdfToR2(file: File, scope: R2UploadScopeUi): Promise<string> {
  const contentType = file.type;
  if (contentType !== PDF_CONTENT_TYPE) {
    throw new Error(`Use a PDF file (got: ${contentType || "empty"})`);
  }
  return postMultipartUpload(file, scope);
}

async function normalizeSpreadsheetFileForUpload(file: File): Promise<File> {
  if (SPREADSHEET_TYPES.has(file.type)) {
    return file;
  }
  const name = file.name.toLowerCase();
  const buf = await file.arrayBuffer();
  if (name.endsWith(".xlsx")) {
    return new File([buf], file.name, { type: SPREADSHEET_XLSX });
  }
  if (name.endsWith(".xls")) {
    return new File([buf], file.name, { type: SPREADSHEET_XLS });
  }
  throw new Error("Use an Excel file (.xlsx or .xls).");
}

/** Excel specs upload (same R2 flow as PDF). */
export async function uploadExcelToR2(file: File, scope: R2UploadScopeUi): Promise<string> {
  const normalized = await normalizeSpreadsheetFileForUpload(file);
  return postMultipartUpload(normalized, scope);
}
