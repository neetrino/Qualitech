import { homeAssets, solutionCardsLayout } from "@/features/home/home.data";

/** Visual assets for the About page (reuses public home imagery). */
export const aboutAssets = {
  storyImage: homeAssets.robotArm,
  gallery: [
    solutionCardsLayout[0].imageSrc,
    solutionCardsLayout[1].imageSrc,
    solutionCardsLayout[2].imageSrc,
  ] as const,
} as const;
