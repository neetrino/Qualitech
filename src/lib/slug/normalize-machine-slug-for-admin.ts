import { slugifyForUrl } from "@/lib/slug/slugify-for-url";

function decodeUriEscapes(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/**
 * Normalizes product / category / blog slug input in admin to a Latin-only URL slug
 * (`a-z`, `0-9`, single `-`). Decodes accidental URI escapes (e.g. pasted from browser bar),
 * transliterates Cyrillic / Armenian and replaces any other character with `-`.
 */
export function normalizeMachineSlugForAdminStorage(raw: string): string {
  return slugifyForUrl(decodeUriEscapes(raw));
}

/**
 * Same as `normalizeMachineSlugForAdminStorage`, but keeps one trailing `-` while the admin
 * is typing so a separator can be entered between words. Normalize fully on blur / submit.
 */
export function normalizeSlugWhileTyping(raw: string): string {
  const slug = normalizeMachineSlugForAdminStorage(raw);
  const endsWithSeparator = /[^\p{L}\p{N}]$/u.test(raw);
  return slug.length > 0 && endsWithSeparator ? `${slug}-` : slug;
}
