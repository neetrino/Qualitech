import { cache } from "react";

import type { HomeLocale } from "@/features/home/home.messages";
import type contactEn from "../../../locales/en/Contact.json";

export type ContactMessages = typeof contactEn;

const loaders: Record<HomeLocale, () => Promise<{ default: ContactMessages }>> = {
  en: () => import("../../../locales/en/Contact.json"),
  ru: () => import("../../../locales/ru/Contact.json"),
};

/**
 * Loads contact page copy from `locales/<locale>/Contact.json`.
 * Dedupes when used from `generateMetadata` and the page in the same request.
 */
export const loadContactMessages = cache(async (locale: HomeLocale): Promise<ContactMessages> => {
  const mod = await loaders[locale]();
  return mod.default;
});
