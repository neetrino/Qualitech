import {
  BLOG_INLINE_IMAGE_MIN_BLOCKS_FOR_MID,
  BLOG_PLAIN_TEXT_HEADING_MAX_CHARS,
} from "@/features/blog/blog.constants";
import { htmlToPlainText } from "@/lib/html/html-to-plain-excerpt";

const TOP_LEVEL_BLOCK_RE =
  /<(p|h[1-6]|ul|ol|blockquote|pre|figure|div)(\s[^>]*)?>[\s\S]*?<\/\1\s*>|<hr\s*\/?>/gi;

const HAS_HTML_TAG_RE = /<[a-z][\s\S]*>/i;

function escapeHtmlText(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function isPlainTextHeading(line: string): boolean {
  if (line.length === 0 || line.length > BLOG_PLAIN_TEXT_HEADING_MAX_CHARS) {
    return false;
  }
  return !/[.!?…:;]$/u.test(line);
}

function wrapPlainTextLine(line: string): string {
  const safe = escapeHtmlText(line);
  if (isPlainTextHeading(line)) {
    return `<h2>${safe}</h2>`;
  }
  return `<p>${safe}</p>`;
}

function splitPlainTextBlocks(raw: string): string[] {
  return raw
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map(wrapPlainTextLine);
}

function wrapIfPlain(chunk: string): string {
  if (HAS_HTML_TAG_RE.test(chunk)) {
    return chunk;
  }
  return wrapPlainTextLine(chunk);
}

/**
 * Splits CMS HTML or newline-separated plain text into top-level blocks
 * so a figure can sit between paragraphs.
 */
export function splitBlogContentBlocks(html: string): string[] {
  const trimmed = html.trim();
  if (trimmed.length === 0) {
    return [];
  }
  if (!HAS_HTML_TAG_RE.test(trimmed)) {
    return splitPlainTextBlocks(trimmed);
  }

  const blocks: string[] = [];
  const matcher = new RegExp(TOP_LEVEL_BLOCK_RE.source, TOP_LEVEL_BLOCK_RE.flags);
  let lastIndex = 0;
  let match = matcher.exec(trimmed);
  while (match !== null) {
    const gap = trimmed.slice(lastIndex, match.index).trim();
    if (gap.length > 0) {
      blocks.push(wrapIfPlain(gap));
    }
    blocks.push(match[0]);
    lastIndex = match.index + match[0].length;
    match = matcher.exec(trimmed);
  }
  const tail = trimmed.slice(lastIndex).trim();
  if (tail.length > 0) {
    blocks.push(wrapIfPlain(tail));
  }
  return blocks.length > 0 ? blocks : [trimmed];
}

export function joinBlogContentBlocks(blocks: readonly string[]): string {
  return blocks.join("");
}

function isHeadingBlock(html: string): boolean {
  return /^<h[1-6]\b/i.test(html.trim());
}

/**
 * Drops leading body blocks that already appear in the excerpt dek.
 */
export function dropBlocksCoveredByExcerpt(blocks: readonly string[], excerpt: string): string[] {
  const excerptNorm = htmlToPlainText(excerpt);
  if (excerptNorm.length === 0 || blocks.length === 0) {
    return [...blocks];
  }

  let consumed = "";
  let index = 0;
  while (index < blocks.length) {
    const nextPlain = htmlToPlainText(blocks[index] ?? "");
    const next = consumed.length > 0 ? `${consumed} ${nextPlain}` : nextPlain;
    if (next.length > excerptNorm.length || !excerptNorm.startsWith(next)) {
      break;
    }
    consumed = next;
    index += 1;
    if (consumed === excerptNorm) {
      break;
    }
  }

  if (consumed !== excerptNorm) {
    return [...blocks];
  }
  return blocks.slice(index);
}

/**
 * Mid-article when there is enough copy on both sides; otherwise after the body.
 * Never lands directly after a heading (figure would orphan the title).
 */
export function getBlogInlineImageInsertIndex(blocks: readonly string[]): number {
  const blockCount = blocks.length;
  if (blockCount < BLOG_INLINE_IMAGE_MIN_BLOCKS_FOR_MID) {
    return blockCount;
  }
  let index = Math.ceil(blockCount / 2);
  while (index > 0 && index < blockCount && isHeadingBlock(blocks[index - 1] ?? "")) {
    index += 1;
  }
  return index;
}
