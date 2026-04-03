import type { BlogPostDetailDto, BlogPostListItemDto } from "@/features/blog/blog.dto";
import type { BlogPostListRow, BlogPostTranslationDetailRow } from "@/features/blog/blog.repository";

function toIso(d: Date | null): string | null {
  return d === null ? null : d.toISOString();
}

export function mapBlogListRow(row: BlogPostListRow): BlogPostListItemDto {
  const tr = row.translations[0];
  if (!tr) {
    throw new Error("Invariant: published post missing translation for locale");
  }
  const img = row.images[0];
  return {
    id: row.id,
    slug: tr.slug,
    title: tr.title,
    excerpt: tr.excerpt,
    publishedAt: toIso(row.publishedAt),
    coverImage: img
      ? { url: img.url, alt: img.alt, sortOrder: img.sortOrder }
      : null,
  };
}

export function mapBlogDetailRow(row: BlogPostTranslationDetailRow): BlogPostDetailDto {
  const { post } = row;
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
    images: post.images.map((i) => ({
      url: i.url,
      alt: i.alt,
      sortOrder: i.sortOrder,
    })),
  };
}
