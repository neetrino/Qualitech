import sanitizeHtml from "sanitize-html";

const DEFAULT_MAX_EXCERPT = 320;

/** Strips tags; collapses whitespace (for SEO snippets and catalog cards). */
export function htmlToPlainText(html: string): string {
  const plain = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });
  return plain.replace(/\s+/g, " ").trim();
}

export function htmlToPlainExcerpt(html: string, maxLen: number = DEFAULT_MAX_EXCERPT): string {
  const collapsed = htmlToPlainText(html);
  if (collapsed.length <= maxLen) {
    return collapsed;
  }
  return `${collapsed.slice(0, Math.max(0, maxLen - 1)).trimEnd()}…`;
}
