import Image from "next/image";

import { homeAssets } from "@/features/home/home.data";

/** Dark fade from hero image into lower content (matches common reference layouts). */
export const HERO_BOTTOM_SCRIM_CLASS =
  "pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[min(50vh,520px)] bg-[linear-gradient(to_top,rgb(0_0_0)_0%,rgba(0,0,0,0.88)_16%,rgba(0,0,0,0.48)_48%,rgba(0,0,0,0)_100%)] sm:h-[min(48vh,560px)] lg:h-[min(42vh,600px)]";

/** Clears the fixed header so hero copy stays readable; tuned to Header outer padding + inner bar height. */
export const HERO_CONTENT_TOP_PAD =
  "pt-[7.75rem] sm:pt-[8.25rem] md:pt-[8.5rem] lg:pt-[6.75rem] xl:pt-28";

type HeroBackgroundLayersProps = {
  readonly imagePriority?: boolean;
};

/**
 * Full-viewport hero backdrop + bottom scrim (shared by home and inner pages).
 */
export function HeroBackgroundLayers({ imagePriority = false }: HeroBackgroundLayersProps) {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 w-full">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            alt=""
            className="absolute inset-0 h-full w-full max-w-none object-cover object-[50%_62%] brightness-[1.12] contrast-[0.98] sm:object-[50%_58%] lg:object-[50%_55%]"
            fill
            priority={imagePriority}
            sizes="100vw"
            src={homeAssets.heroBackdrop}
          />
        </div>
      </div>
      <div aria-hidden className={HERO_BOTTOM_SCRIM_CLASS} />
    </>
  );
}
