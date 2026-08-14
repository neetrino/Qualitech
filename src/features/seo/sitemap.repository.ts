import { AppLocale } from "@prisma/client";

import type { HomeLocale } from "@/features/home/home.messages";
import type {
  SitemapBlogPostRow,
  SitemapCategoryRow,
  SitemapMachineRow,
} from "@/features/seo/seo.types";
import { prisma } from "@/lib/db";

function localesFromRows(rows: readonly { locale: AppLocale }[]): HomeLocale[] {
  const out: HomeLocale[] = [];
  for (const row of rows) {
    if ((row.locale === "en" || row.locale === "ru") && !out.includes(row.locale)) {
      out.push(row.locale);
    }
  }
  return out;
}

export async function findPublishedSitemapCategories(): Promise<SitemapCategoryRow[]> {
  const rows = await prisma.machineCategory.findMany({
    where: { published: true },
    select: {
      slug: true,
      updatedAt: true,
      translations: { select: { locale: true } },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return rows.flatMap((row) => {
    const slug = row.slug.trim();
    const locales = localesFromRows(row.translations);
    if (slug.length === 0 || locales.length === 0) {
      return [];
    }
    return [{ slug, updatedAt: row.updatedAt, locales }];
  });
}

export async function findPublishedSitemapMachines(): Promise<SitemapMachineRow[]> {
  const rows = await prisma.machine.findMany({
    where: {
      published: true,
      category: { published: true },
    },
    select: {
      slug: true,
      updatedAt: true,
      category: { select: { slug: true } },
      translations: { select: { locale: true } },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return rows.flatMap((row) => {
    const slug = row.slug.trim();
    const categorySlug = row.category?.slug.trim() ?? "";
    const locales = localesFromRows(row.translations);
    if (slug.length === 0 || categorySlug.length === 0 || locales.length === 0) {
      return [];
    }
    return [{ slug, categorySlug, updatedAt: row.updatedAt, locales }];
  });
}

export async function findPublishedSitemapBlogPosts(): Promise<SitemapBlogPostRow[]> {
  const rows = await prisma.blogPost.findMany({
    where: { published: true },
    select: {
      slug: true,
      updatedAt: true,
      publishedAt: true,
      translations: { select: { locale: true } },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return rows.flatMap((row) => {
    const slug = row.slug.trim();
    const locales = localesFromRows(row.translations);
    if (slug.length === 0 || locales.length === 0) {
      return [];
    }
    return [{ slug, updatedAt: row.publishedAt ?? row.updatedAt, locales }];
  });
}
