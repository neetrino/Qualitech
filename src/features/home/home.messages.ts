import type homeEn from "../../../locales/en/home.json";

export type HomeMessages = typeof homeEn;

export type HomeLocale = "en" | "ru";

const loaders: Record<HomeLocale, () => Promise<{ default: HomeMessages }>> = {
  en: () => import("../../../locales/en/home.json"),
  ru: () => import("../../../locales/ru/home.json"),
};

/**
 * Loads the home page copy for the given locale (JSON catalogs under `locales/<locale>/home.json`).
 */
export async function loadHomeMessages(locale: HomeLocale): Promise<HomeMessages> {
  const mod = await loaders[locale]();
  return mod.default;
}
