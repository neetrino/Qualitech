import { z } from "zod";

import { normalizeMachineSlugForAdminStorage } from "@/lib/slug/normalize-machine-slug-for-admin";
import { URL_SLUG_PATTERN } from "@/lib/slug/slug-transliteration.constants";

/**
 * Admin slug input: normalized to a Latin-only URL slug, then validated against `URL_SLUG_PATTERN`.
 */
export function createAdminSlugSchema(maxLength: number) {
  return z
    .string()
    .trim()
    .max(maxLength)
    .transform((s) => normalizeMachineSlugForAdminStorage(s))
    .pipe(
      z
        .string()
        .min(1, "Slug must contain at least one Latin letter or digit")
        .max(maxLength)
        .regex(URL_SLUG_PATTERN, "Slug may contain only Latin letters, digits and hyphens"),
    );
}
