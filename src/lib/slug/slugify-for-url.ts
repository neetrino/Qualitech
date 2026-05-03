/**
 * Russian Cyrillic → Latin (URL-style, aligned with seed transliteration).
 * Latin letters are lowercased; accents stripped; sequences of alphanumerics joined with `-`.
 */
const CYRILLIC_TO_LATIN: Readonly<Record<string, string>> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

function transliterateCyrillicChar(ch: string): string {
  const lower = ch.toLowerCase();
  const mapped = CYRILLIC_TO_LATIN[lower];
  return mapped !== undefined ? mapped : ch;
}

function stripLatinCombiningMarks(s: string): string {
  return s.normalize("NFD").replace(/\p{M}/gu, "");
}

/**
 * Builds a URL path–friendly slug from a human title (empty string if nothing usable remains).
 */
export function slugifyForUrl(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return "";
  }
  let out = "";
  for (const ch of trimmed) {
    out += transliterateCyrillicChar(ch);
  }
  out = stripLatinCombiningMarks(out);
  out = out.toLowerCase();
  out = out.replace(/[^a-z0-9]+/g, "-");
  out = out.replace(/-+/g, "-").replace(/^-|-$/g, "");
  return out;
}
