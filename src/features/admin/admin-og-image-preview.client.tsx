"use client";

import { useEffect, useState } from "react";

import type { AdminTheme } from "@/features/admin/admin-theme.constants";

const HTTP_URL = /^https?:\/\//i;

type AdminOgImagePreviewProps = {
  readonly theme: AdminTheme;
  readonly url: string;
};

/**
 * Renders a preview when `url` looks like an http(s) image URL; hides on load error.
 */
export function AdminOgImagePreview({ theme, url }: AdminOgImagePreviewProps) {
  const trimmed = url.trim();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [trimmed]);

  if (!HTTP_URL.test(trimmed) || failed) {
    return null;
  }

  const shell =
    theme === "light"
      ? "mb-3 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100"
      : "mb-3 overflow-hidden rounded-lg border border-white/15 bg-black";

  return (
    <div className={shell}>
      {/* Arbitrary admin-pasted URLs (R2 / CDN); `next/image` would need dynamic remotePatterns. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- OG preview is any https URL */}
      <img
        alt=""
        className="max-h-52 w-full object-contain object-center"
        decoding="async"
        loading="lazy"
        onError={() => setFailed(true)}
        src={trimmed}
      />
    </div>
  );
}
