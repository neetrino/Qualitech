/** Public site origin used in sitemap, robots.txt, and metadata. */
export const CANONICAL_SITE_ORIGIN = "https://qualitechmachinery.ru";

function originFromEnvValue(raw: string | undefined): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    if (url.hostname.length === 0) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

function isLocalDevOrigin(origin: string): boolean {
  const hostname = new URL(origin).hostname;
  return hostname === "localhost" || hostname === "127.0.0.1";
}

/**
 * Canonical site origin for metadata, sitemap, and robots.
 * Uses `APP_URL` / `NEXT_PUBLIC_APP_URL` when they are a public host;
 * localhost env values fall back to {@link CANONICAL_SITE_ORIGIN}.
 */
export function getSiteOrigin(): string {
  const fromEnv =
    originFromEnvValue(process.env.APP_URL) ?? originFromEnvValue(process.env.NEXT_PUBLIC_APP_URL);
  if (fromEnv && !isLocalDevOrigin(fromEnv)) {
    return fromEnv;
  }
  return CANONICAL_SITE_ORIGIN;
}
