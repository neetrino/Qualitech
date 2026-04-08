import { cache } from "react";

import type homeEn from "../../../locales/en/home.json";

export type HomeMessages = typeof homeEn;

export type HomeLocale = "en" | "ru";

const loaders: Record<HomeLocale, () => Promise<{ default: HomeMessages }>> = {
  en: () => import("../../../locales/en/home.json"),
  ru: () => import("../../../locales/ru/home.json"),
};

/**
 * Loads the home page copy for the given locale (JSON catalogs under `locales/<locale>/home.json`).
 * Wrapped with `cache()` so `generateMetadata` and the page share one import per request.
 */
export const loadHomeMessages = cache(async (locale: HomeLocale): Promise<HomeMessages> => {
  const mod = await loaders[locale]();
  return mod.default;
});
