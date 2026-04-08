import { z } from "zod";

import {
  CONTACT_MESSAGE_MAX_LEN,
  CONTACT_NAME_MAX_LEN,
} from "@/features/contact/contact.constants";

export const contactSubmitBodySchema = z.object({
  name: z.string().trim().min(1).max(CONTACT_NAME_MAX_LEN),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(1).max(CONTACT_MESSAGE_MAX_LEN),
  /** Required when `RECAPTCHA_SECRET_KEY` is set server-side. */
  recaptchaToken: z.string().min(1).max(4000).optional(),
});

export type ContactSubmitBody = z.infer<typeof contactSubmitBodySchema>;

/** Optional `Idempotency-Key` header (UUID) for safe retries. */
export const contactIdempotencyKeyHeaderSchema = z
  .string()
  .trim()
  .uuid()
  .optional();
