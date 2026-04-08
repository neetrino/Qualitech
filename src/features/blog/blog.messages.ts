import { cache } from "react";

import type { HomeLocale } from "@/features/home/home.messages";
import type blogEn from "../../../locales/en/Blog.json";

export type BlogMessages = typeof blogEn;

const loaders: Record<HomeLocale, () => Promise<{ default: BlogMessages }>> = {
  en: () => import("../../../locales/en/Blog.json"),
  ru: () => import("../../../locales/ru/Blog.json"),
};

/** Dedupes JSON import when metadata and page both need blog copy. */
export const loadBlogMessages = cache(async (locale: HomeLocale): Promise<BlogMessages> => {
  const mod = await loaders[locale]();
  return mod.default;
});
