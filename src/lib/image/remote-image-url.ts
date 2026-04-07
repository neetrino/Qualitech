/**
 * Remote absolute image URLs should use `next/image` with `unoptimized` (or `remotePatterns`).
 * Handles leading/trailing whitespace, protocol-relative URLs, and case-insensitive schemes.
 */
export function isRemoteImageUrl(src: string): boolean {
  const s = src.trim();
  if (s.length === 0) {
    return false;
  }
  if (s.startsWith("//")) {
    return true;
  }
  return /^https?:\/\//i.test(s);
}

/**
 * Values stored in the DB may be protocol-relative (`//host/...`). `next/image` is more reliable
 * with an explicit scheme; use https for protocol-relative URLs.
 */
export function normalizeStoredImageUrl(url: string): string {
  const s = url.trim();
  if (s.startsWith("//")) {
    return `https:${s}`;
  }
  return s;
}
