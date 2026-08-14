import type { HomeLocale } from "@/features/home/home.messages";

export type SitemapChangeFrequency = "daily" | "weekly";

export type SitemapHreflang = HomeLocale | "x-default";

export type SitemapUrlEntry = {
  readonly loc: string;
  readonly lastModified?: Date;
  readonly changeFrequency: SitemapChangeFrequency;
  readonly priority: number;
  readonly alternateHrefByLang: Partial<Record<SitemapHreflang, string>>;
};

export type SitemapMachineRow = {
  readonly slug: string;
  readonly categorySlug: string;
  readonly updatedAt: Date;
  readonly locales: readonly HomeLocale[];
};

export type SitemapCategoryRow = {
  readonly slug: string;
  readonly updatedAt: Date;
  readonly locales: readonly HomeLocale[];
};

export type SitemapBlogPostRow = {
  readonly slug: string;
  readonly updatedAt: Date;
  readonly locales: readonly HomeLocale[];
};
