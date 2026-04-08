import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

function remotePatternFromPublicBaseUrl(baseUrl: string | undefined): RemotePattern | null {
  const raw = baseUrl?.trim();
  if (!raw) {
    return null;
  }
  try {
    const u = new URL(raw);
    if (u.hostname.length === 0) {
      return null;
    }
    const protocol = u.protocol === "http:" ? ("http" as const) : ("https" as const);
    return { protocol, hostname: u.hostname, pathname: "/**" };
  } catch {
    return null;
  }
}

const r2PublicPattern = remotePatternFromPublicBaseUrl(process.env.R2_PUBLIC_URL);

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  /** Allow R2/CDN URLs when `unoptimized` is false (defense in depth; we still set unoptimized for remote). */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.dev", pathname: "/**" },
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com", pathname: "/**" },
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      ...(r2PublicPattern ? [r2PublicPattern] : []),
    ],
  },
};

export { nextConfig as default };
