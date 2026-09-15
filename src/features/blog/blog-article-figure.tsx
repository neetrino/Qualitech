import Image from "next/image";

import type { BlogPostImageDto } from "@/features/blog/blog.dto";

type BlogArticleFigureProps = {
  readonly image: BlogPostImageDto;
  readonly fallbackAlt: string;
};

export function BlogArticleFigure({ image, fallbackAlt }: BlogArticleFigureProps) {
  const alt = image.alt?.trim() || fallbackAlt;
  const remote = image.url.startsWith("http");
  return (
    <figure className="my-10 overflow-hidden rounded-2xl border border-[#18181b] bg-[#09090b] sm:my-12">
      <div className="relative aspect-[16/10] w-full bg-[#0f172a]">
        <Image
          alt={alt}
          className="object-cover object-center"
          fill
          sizes="(max-width: 800px) 100vw, 800px"
          src={image.url}
          unoptimized={remote}
        />
      </div>
    </figure>
  );
}
