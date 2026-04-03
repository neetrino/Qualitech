import type { AppLocale } from "@prisma/client";

import type { BlogPostDetailDto, BlogPostsListResult } from "@/features/blog/blog.dto";
import { mapBlogDetailRow, mapBlogListRow } from "@/features/blog/blog.mappers";
import {
  countBlogPostsForList,
  findBlogPostDetailBySlug,
  findBlogPostsForList,
} from "@/features/blog/blog.repository";
import type { BlogListQuery } from "@/features/blog/blog.schemas";

export async function listBlogPostsPublic(query: BlogListQuery): Promise<BlogPostsListResult> {
  const [total, rows] = await Promise.all([countBlogPostsForList(query), findBlogPostsForList(query)]);
  return {
    data: rows.map(mapBlogListRow),
    meta: { page: query.page, limit: query.limit, total },
  };
}

export async function getBlogPostBySlugPublic(
  slug: string,
  locale: AppLocale,
): Promise<BlogPostDetailDto | null> {
  const row = await findBlogPostDetailBySlug(slug, locale);
  if (!row) {
    return null;
  }
  return mapBlogDetailRow(row);
}
