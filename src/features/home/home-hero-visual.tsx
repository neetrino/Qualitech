import Image from "next/image";

import { homeAssets } from "@/features/home/home.data";

/** Figma file QUALITECH — node `1:4` "App" background (full-page wash). */
export const HOME_PAGE_BACKGROUND_CLASS =
  "bg-[linear-gradient(200.76deg,rgb(37_37_37)_14.56%,rgb(0_0_0)_90.79%)]";

/** Fades the hero photo at the bottom so the page `main` gradient shows through (no hard photo edge). */
const HERO_IMAGE_MASK_CLASS =
  "[mask-image:linear-gradient(to_bottom,#000_0%,#000_62%,rgba(0_0_0_/_0.45)_78%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_62%,rgba(0_0_0_/_0.45)_78%,transparent_100%)]";

/** Below `md`: fixed glass mobile header + safe area; from `md`: desktop header clearance. */
export const HERO_CONTENT_TOP_PAD =
  "pt-[calc(4.5rem+env(safe-area-inset-top))] sm:pt-[calc(4.75rem+env(safe-area-inset-top))] md:pt-[8.5rem] lg:pt-[6.75rem] xl:pt-28";

/** Softens the seam between the hero and the solutions block (full-bleed top gradient). */
export const SOLUTIONS_TOP_FOLD_SCRIM_CLASS =
  "pointer-events-none absolute left-1/2 top-0 z-0 h-20 w-screen max-w-[100vw] -translate-x-1/2 bg-gradient-to-b from-black/35 to-transparent sm:h-28";

type HeroBackgroundLayersProps = {
  readonly imagePriority?: boolean;
};

/**
 * Full-viewport hero backdrop (shared by home and inner pages).
 */
export function HeroBackgroundLayers({ imagePriority = false }: HeroBackgroundLayersProps) {
  return (
    <div className="pointer-events-none absolute inset-0 w-full">
      <div className={`absolute inset-0 overflow-hidden ${HERO_IMAGE_MASK_CLASS}`}>
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
  );
}
