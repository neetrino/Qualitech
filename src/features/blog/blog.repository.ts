import type { AppLocale, Prisma } from "@prisma/client";

import type { BlogListQuery } from "@/features/blog/blog.schemas";
import { prisma } from "@/lib/db";

function buildListWhere(query: BlogListQuery): Prisma.BlogPostWhereInput {
  return {
    published: true,
    translations: { some: { locale: query.locale } },
  };
}

export async function findBlogPostsForList(query: BlogListQuery) {
  const skip = (query.page - 1) * query.limit;
  const where = buildListWhere(query);
  return prisma.blogPost.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    skip,
    take: query.limit,
    include: {
      translations: { where: { locale: query.locale } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
  });
}

export async function countBlogPostsForList(query: BlogListQuery): Promise<number> {
  return prisma.blogPost.count({ where: buildListWhere(query) });
}

export async function findBlogPostDetailBySlug(slug: string, locale: AppLocale) {
  const post = await prisma.blogPost.findFirst({
    where: {
      slug,
      published: true,
    },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      translations: { where: { locale }, take: 1 },
    },
  });
  const translation = post?.translations[0];
  if (!post || !translation) {
    return null;
  }
  return { post, translation };
}

export type BlogPostListRow = Awaited<ReturnType<typeof findBlogPostsForList>>[number];

type DetailLookup = Awaited<ReturnType<typeof findBlogPostDetailBySlug>>;
export type BlogPostDetailRow = Exclude<DetailLookup, null>;
