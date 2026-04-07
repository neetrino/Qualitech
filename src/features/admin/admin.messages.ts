import type { HomeLocale } from "@/features/home/home.messages";

import type adminEn from "../../../locales/en/admin.json";

export type AdminMessages = typeof adminEn;

const loaders: Record<HomeLocale, () => Promise<{ default: AdminMessages }>> = {
  en: () => import("../../../locales/en/admin.json"),
  ru: () => import("../../../locales/ru/admin.json"),
};

/** Loads admin UI copy for the given locale (`locales/<locale>/admin.json`). */
export async function loadAdminMessages(locale: HomeLocale): Promise<AdminMessages> {
  const mod = await loaders[locale]();
  return mod.default;
}
