import { solutionCardsLayout } from "@/features/home/home.data";

/** Visual assets for the About page (reuses public home imagery). */
export const aboutAssets = {
  storyImage: "/home/IMG_5337.JPG",
  gallery: [
    solutionCardsLayout[0].imageSrc,
    solutionCardsLayout[1].imageSrc,
    solutionCardsLayout[2].imageSrc,
  ] as const,
} as const;
