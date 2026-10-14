import { ARMENIAN_TO_LATIN, CYRILLIC_TO_LATIN } from "@/lib/slug/slug-transliteration.constants";

/**
 * Cyrillic / Armenian → Latin; Latin letters are lowercased; accents stripped;
 * sequences of alphanumerics joined with `-`.
 */
function transliterateChar(ch: string): string {
  const lower = ch.toLowerCase();
  return CYRILLIC_TO_LATIN[lower] ?? ARMENIAN_TO_LATIN[lower] ?? ch;
}

function stripLatinCombiningMarks(s: string): string {
  return s.normalize("NFD").replace(/\p{M}/gu, "");
}

/**
 * Builds a URL path–friendly slug from a human title (empty string if nothing usable remains).
 * Output always matches `URL_SLUG_PATTERN` or is empty.
 */
export function slugifyForUrl(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return "";
  }
  let out = "";
  for (const ch of trimmed) {
    out += transliterateChar(ch);
  }
  out = stripLatinCombiningMarks(out);
  out = out.toLowerCase();
  out = out.replace(/[^a-z0-9]+/g, "-");
  out = out.replace(/-+/g, "-").replace(/^-|-$/g, "");
  return out;
}
