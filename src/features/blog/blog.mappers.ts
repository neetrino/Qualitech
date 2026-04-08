import type { AppLocale } from "@prisma/client";

import type { BlogPostDetailDto, BlogPostListItemDto } from "@/features/blog/blog.dto";
import type { BlogPostListRow, BlogPostTranslationDetailRow } from "@/features/blog/blog.repository";

function toIso(d: Date | null): string | null {
  return d === null ? null : d.toISOString();
}

function buildSlugByLocale(translations: { locale: AppLocale; slug: string }[]): Partial<Record<AppLocale, string>> {
  const out: Partial<Record<AppLocale, string>> = {};
  for (const t of translations) {
    out[t.locale] = t.slug;
  }
  return out;
}

function pickCoverImage(
  galleryFirst: BlogPostListRow["images"][number] | undefined,
  ogImageUrl: string | null,
): BlogPostListItemDto["coverImage"] {
  if (galleryFirst) {
    return {
      url: galleryFirst.url,
      alt: galleryFirst.alt,
      sortOrder: galleryFirst.sortOrder,
    };
  }
  const og = ogImageUrl?.trim();
  if (og) {
    return { url: og, alt: null, sortOrder: 0 };
  }
  return null;
}

export function mapBlogListRow(row: BlogPostListRow): BlogPostListItemDto {
  const tr = row.translations[0];
  if (!tr) {
    throw new Error("Invariant: published post missing translation for locale");
  }
  return {
    id: row.id,
    slug: tr.slug,
    title: tr.title,
    excerpt: tr.excerpt,
    publishedAt: toIso(row.publishedAt),
    coverImage: pickCoverImage(row.images[0], tr.ogImageUrl),
  };
}

export function mapBlogDetailRow(row: BlogPostTranslationDetailRow): BlogPostDetailDto {
  const { post } = row;
  const gallery = post.images.map((i) => ({
    url: i.url,
    alt: i.alt,
    sortOrder: i.sortOrder,
  }));
  const og = row.ogImageUrl?.trim();
  const images =
    gallery.length > 0
      ? gallery
      : og
        ? [{ url: og, alt: null, sortOrder: 0 }]
        : [];
  return {
    id: post.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    ogImageUrl: row.ogImageUrl,
    publishedAt: toIso(post.publishedAt),
    images,
    slugByLocale: buildSlugByLocale(post.translations),
  };
}
