const LOCAL_DEV_ORIGIN = "http://localhost:3000";

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

/**
 * Canonical site origin for metadata, sitemap, and robots.
 * Prefers `APP_URL`, then `NEXT_PUBLIC_APP_URL`, then local dev.
 */
export function getSiteOrigin(): string {
  return (
    originFromEnvValue(process.env.APP_URL) ??
    originFromEnvValue(process.env.NEXT_PUBLIC_APP_URL) ??
    LOCAL_DEV_ORIGIN
  );
}
