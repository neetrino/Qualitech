import type { AppLocale } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { BLOG_PUBLIC_CACHE_TAG, BLOG_PUBLIC_DATA_REVALIDATE_SEC } from "@/features/blog/blog.constants";
import type { BlogPostDetailDto, BlogPostsListResult } from "@/features/blog/blog.dto";
import { mapBlogDetailRow, mapBlogListRow } from "@/features/blog/blog.mappers";
import {
  countBlogPostsForList,
  findBlogPostDetailBySlug,
  findBlogPostsForList,
} from "@/features/blog/blog.repository";
import type { BlogListQuery } from "@/features/blog/blog.schemas";

export async function listBlogPostsPublic(query: BlogListQuery): Promise<BlogPostsListResult> {
  const cached = unstable_cache(
    async () => {
      const [total, rows] = await Promise.all([countBlogPostsForList(query), findBlogPostsForList(query)]);
      return {
        data: rows.map(mapBlogListRow),
        meta: { page: query.page, limit: query.limit, total },
      };
    },
    ["blog-posts-list", query.locale, String(query.page), String(query.limit)],
    { revalidate: BLOG_PUBLIC_DATA_REVALIDATE_SEC, tags: [BLOG_PUBLIC_CACHE_TAG] },
  );
  return cached();
}

export async function getBlogPostBySlugPublic(
  slug: string,
  locale: AppLocale,
): Promise<BlogPostDetailDto | null> {
  const cached = unstable_cache(
    async () => {
      const row = await findBlogPostDetailBySlug(slug, locale);
      if (!row) {
        return null;
      }
      return mapBlogDetailRow(row);
    },
    ["blog-post-detail", locale, slug],
    { revalidate: BLOG_PUBLIC_DATA_REVALIDATE_SEC, tags: [BLOG_PUBLIC_CACHE_TAG] },
  );
  return cached();
}
