import type { AppLocale } from "@prisma/client";

import type { BlogPostDetailDto, BlogPostListItemDto } from "@/features/blog/blog.dto";
import type { BlogPostDetailRow, BlogPostListRow } from "@/features/blog/blog.repository";

function toIso(d: Date | null): string | null {
  return d === null ? null : d.toISOString();
}

function sharedSlugByLocale(slug: string): Partial<Record<AppLocale, string>> {
  return { en: slug, ru: slug };
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
    slug: row.slug,
    title: tr.title,
    excerpt: tr.excerpt,
    publishedAt: toIso(row.publishedAt),
    coverImage: pickCoverImage(row.images[0], tr.ogImageUrl),
  };
}

export function mapBlogDetailRow(row: BlogPostDetailRow): BlogPostDetailDto {
  const { post, translation } = row;
  const gallery = post.images.map((i) => ({
    url: i.url,
    alt: i.alt,
    sortOrder: i.sortOrder,
  }));
  const og = translation.ogImageUrl?.trim();
  const images =
    gallery.length > 0
      ? gallery
      : og
        ? [{ url: og, alt: null, sortOrder: 0 }]
        : [];
  return {
    id: post.id,
    slug: post.slug,
    title: translation.title,
    excerpt: translation.excerpt,
    content: translation.content,
    metaTitle: translation.metaTitle,
    metaDescription: translation.metaDescription,
    ogImageUrl: translation.ogImageUrl,
    publishedAt: toIso(post.publishedAt),
    images,
    slugByLocale: sharedSlugByLocale(post.slug),
  };
}
