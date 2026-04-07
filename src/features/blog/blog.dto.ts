import type { AppLocale } from "@prisma/client";

export type BlogPostImageDto = {
  url: string;
  alt: string | null;
  sortOrder: number;
};

export type BlogPostListItemDto = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string | null;
  coverImage: BlogPostImageDto | null;
};

export type BlogPostDetailDto = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  publishedAt: string | null;
  images: BlogPostImageDto[];
  /** Slugs per locale for the same post (language switcher, hreflang). */
  slugByLocale: Partial<Record<AppLocale, string>>;
};

export type BlogPostsListResult = {
  data: BlogPostListItemDto[];
  meta: { page: number; limit: number; total: number };
};
