import { cache } from "react";

import type { HomeLocale } from "@/features/home/home.messages";
import type aboutEn from "../../../locales/en/About.json";

export type AboutMessages = typeof aboutEn;

const loaders: Record<HomeLocale, () => Promise<{ default: AboutMessages }>> = {
  en: () => import("../../../locales/en/About.json"),
  ru: () => import("../../../locales/ru/About.json"),
};

/**
 * Loads about page copy from `locales/<locale>/About.json`.
 * Dedupes when used from `generateMetadata` and the page in the same request.
 */
export const loadAboutMessages = cache(async (locale: HomeLocale): Promise<AboutMessages> => {
  const mod = await loaders[locale]();
  return mod.default;
});
