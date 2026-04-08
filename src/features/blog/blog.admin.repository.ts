import type { Prisma } from "@prisma/client";

import type { AdminBlogCreateInput, AdminBlogPatchInput } from "@/features/blog/blog.admin.schemas";
import { prisma } from "@/lib/db";

const blogAdminInclude = {
  translations: true,
  images: { orderBy: { sortOrder: "asc" as const } },
} satisfies Prisma.BlogPostInclude;

export type BlogAdminRow = Prisma.BlogPostGetPayload<{ include: typeof blogAdminInclude }>;

function resolvePublishedFields(
  existing: { published: boolean; publishedAt: Date | null },
  patch: AdminBlogPatchInput,
): { published: boolean; publishedAt: Date | null } {
  const published = patch.published ?? existing.published;
  let publishedAt =
    patch.publishedAt !== undefined ? patch.publishedAt : existing.publishedAt;

  if (patch.published === false) {
    publishedAt = null;
  }
  if (patch.published === true && publishedAt === null && patch.publishedAt === undefined) {
    publishedAt = new Date();
  }

  return { published, publishedAt };
}

export async function adminListBlogPosts(): Promise<BlogAdminRow[]> {
  return prisma.blogPost.findMany({
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: blogAdminInclude,
  });
}

export async function adminGetBlogPostById(id: string): Promise<BlogAdminRow | null> {
  return prisma.blogPost.findUnique({
    where: { id },
    include: blogAdminInclude,
  });
}

export async function adminCreateBlogPost(data: AdminBlogCreateInput): Promise<BlogAdminRow> {
  const publishedAt = data.published ? (data.publishedAt ?? new Date()) : null;
  return prisma.blogPost.create({
    data: {
      published: data.published,
      publishedAt,
      translations: { create: data.translations },
      images: { create: data.images },
    },
    include: blogAdminInclude,
  });
}

function buildBlogUpdateData(
  existing: { published: boolean; publishedAt: Date | null },
  patch: AdminBlogPatchInput,
): Prisma.BlogPostUpdateInput {
  const data: Prisma.BlogPostUpdateInput = {};
  const touchedPublished = patch.published !== undefined || patch.publishedAt !== undefined;

  if (touchedPublished) {
    const next = resolvePublishedFields(existing, patch);
    data.published = next.published;
    data.publishedAt = next.publishedAt;
  }

  if (patch.translations) {
    data.translations = { deleteMany: {}, create: patch.translations };
  }
  if (patch.images) {
    data.images = { deleteMany: {}, create: patch.images };
  }
  return data;
}

export async function adminUpdateBlogPost(
  id: string,
  patch: AdminBlogPatchInput,
): Promise<BlogAdminRow | null> {
  const existing = await prisma.blogPost.findUnique({
    where: { id },
    select: { id: true, published: true, publishedAt: true },
  });
  if (!existing) {
    return null;
  }

  const data = buildBlogUpdateData(existing, patch);
  if (Object.keys(data).length > 0) {
    await prisma.blogPost.update({ where: { id }, data });
  }

  return adminGetBlogPostById(id);
}

export async function adminDeleteBlogPost(id: string): Promise<boolean> {
  const result = await prisma.blogPost.deleteMany({ where: { id } });
  return result.count > 0;
}
