import { z } from "zod";

import {
  R2_ALLOWED_CONTENT_TYPES,
  R2_MAX_UPLOAD_BYTES,
  R2_UPLOAD_SCOPES,
} from "@/features/admin/r2/r2.constants";

export const adminPresignUploadBodySchema = z.object({
  scope: z.enum(R2_UPLOAD_SCOPES),
  contentType: z.enum(R2_ALLOWED_CONTENT_TYPES),
  byteLength: z.number().int().min(1).max(R2_MAX_UPLOAD_BYTES),
});

export type AdminPresignUploadBody = z.infer<typeof adminPresignUploadBodySchema>;
