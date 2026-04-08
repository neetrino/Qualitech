"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { isRemoteImageUrl } from "@/lib/image/remote-image-url";

type MachineHeroGalleryProps = {
  readonly images: { url: string; alt: string | null; sortOrder: number; isPrimary: boolean }[];
  readonly fallbackAlt: string;
  readonly initialIndex: number;
};

export function MachineHeroGallery({ images, fallbackAlt, initialIndex }: MachineHeroGalleryProps) {
  const galleryImages = useMemo(
    () =>
      images
        .map((img) => ({
          ...img,
          url: img.url.trim(),
          alt: img.alt?.trim() || fallbackAlt,
        }))
        .filter((img) => img.url.length > 0),
    [fallbackAlt, images],
  );

  const safeInitialIndex =
    initialIndex >= 0 && initialIndex < galleryImages.length ? initialIndex : 0;
  const [activeIndex, setActiveIndex] = useState(safeInitialIndex);
  const activeImage = galleryImages[activeIndex] ?? galleryImages[0];

  if (!activeImage) {
    return null;
  }

  return (
    <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[#18181b] bg-[#09090b] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)] lg:sticky lg:top-28 lg:aspect-auto lg:min-h-[min(70vh,720px)] lg:max-h-[calc(100vh-6rem)]">
        <Image
          alt={activeImage.alt}
          className="object-cover object-center"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          src={activeImage.url}
          unoptimized={isRemoteImageUrl(activeImage.url)}
        />
      </div>

      {galleryImages.length > 1 ? (
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {galleryImages.map((img, index) => (
            <button
              key={`${img.url}-${img.sortOrder}-${String(img.isPrimary)}`}
              aria-label={`Show image ${String(index + 1)}`}
              className={`relative h-16 w-16 overflow-hidden rounded-lg border bg-[#09090b] transition sm:h-20 sm:w-20 md:h-24 md:w-24 ${
                activeIndex === index
                  ? "border-[#ff6900] ring-1 ring-[#ff6900]/50"
                  : "border-[#18181b] hover:border-[#2a2a2f]"
              }`}
              onClick={() => {
                setActiveIndex(index);
              }}
              type="button"
            >
              <Image
                alt={img.alt}
                className="object-cover object-center"
                fill
                sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                src={img.url}
                unoptimized={isRemoteImageUrl(img.url)}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
