"use client";

import { useEffect, useState } from "react";

import type { AdminTheme } from "@/features/admin/admin-theme.constants";

const HTTP_URL = /^https?:\/\//i;

type AdminOgImagePreviewProps = {
  readonly theme: AdminTheme;
  readonly url: string;
  /** `thumb` — list rows; `galleryCard` — product admin grid; `default` — form cover / OG preview. */
  readonly variant?: "default" | "thumb" | "galleryCard";
};

/**
 * Renders a preview when `url` looks like an http(s) image URL; hides on load error.
 */
export function AdminOgImagePreview({ theme, url, variant = "default" }: AdminOgImagePreviewProps) {
  const trimmed = url.trim();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [trimmed]);

  if (!HTTP_URL.test(trimmed) || failed) {
    return null;
  }

  const isThumb = variant === "thumb";
  const isGalleryCard = variant === "galleryCard";
  const shell = isGalleryCard
    ? theme === "light"
      ? "h-36 w-full overflow-hidden bg-zinc-100"
      : "h-36 w-full overflow-hidden bg-black"
    : isThumb
      ? theme === "light"
        ? "shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100"
        : "shrink-0 overflow-hidden rounded-md border border-white/15 bg-black"
      : theme === "light"
        ? "mb-3 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100"
        : "mb-3 overflow-hidden rounded-lg border border-white/15 bg-black";

  const imgClass = isGalleryCard
    ? "h-full w-full object-cover object-center"
    : isThumb
      ? "size-12 object-cover object-center"
      : "max-h-52 w-full object-contain object-center";

  return (
    <div className={shell}>
      {/* Arbitrary admin-pasted URLs (R2 / CDN); `next/image` would need dynamic remotePatterns. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- OG preview is any https URL */}
      <img
        alt=""
        className={imgClass}
        decoding="async"
        loading="lazy"
        onError={() => setFailed(true)}
        src={trimmed}
      />
    </div>
  );
}
