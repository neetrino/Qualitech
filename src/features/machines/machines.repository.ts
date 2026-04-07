import type { AppLocale, Prisma } from "@prisma/client";

import type { MachinesListQuery } from "@/features/machines/machines.schemas";
import { prisma } from "@/lib/db";

function buildListWhere(query: MachinesListQuery): Prisma.MachineWhereInput {
  const { locale, categorySlug, featured } = query;
  const where: Prisma.MachineWhereInput = {
    published: true,
    translations: { some: { locale } },
  };
  if (featured !== undefined) {
    where.featured = featured;
  }
  if (categorySlug !== undefined) {
    where.category = {
      translations: { some: { locale, slug: categorySlug } },
    };
  }
  return where;
}

export async function findMachinesForList(query: MachinesListQuery) {
  const skip = (query.page - 1) * query.limit;
  const where = buildListWhere(query);
  return prisma.machine.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    skip,
    take: query.limit,
    include: {
      translations: { where: { locale: query.locale } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: {
        include: {
          translations: { where: { locale: query.locale } },
        },
      },
    },
  });
}

export async function countMachinesForList(query: MachinesListQuery): Promise<number> {
  return prisma.machine.count({ where: buildListWhere(query) });
}

export async function collectDescendantCategoryIds(rootId: string): Promise<string[]> {
  const ids: string[] = [rootId];
  let frontier = [rootId];
  while (frontier.length > 0) {
    const children = await prisma.machineCategory.findMany({
      where: { parentId: { in: frontier } },
      select: { id: true },
    });
    frontier = children.map((c) => c.id);
    ids.push(...frontier);
  }
  return ids;
}

export async function findTopLevelMachineCategories(locale: AppLocale) {
  return prisma.machineCategory.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
    include: {
      translations: { where: { locale } },
    },
  });
}

export async function findMachineCategoryTranslationBySlug(slug: string, locale: AppLocale) {
  return prisma.machineCategoryTranslation.findFirst({
    where: { locale, slug },
    include: { category: true },
  });
}

function buildListWhereForCategoryIds(
  query: MachinesListQuery,
  categoryIds: string[],
): Prisma.MachineWhereInput {
  const { locale, featured } = query;
  const where: Prisma.MachineWhereInput = {
    published: true,
    translations: { some: { locale } },
    categoryId: { in: categoryIds },
  };
  if (featured !== undefined) {
    where.featured = featured;
  }
  return where;
}

export async function findMachinesForListInCategoryIds(query: MachinesListQuery, categoryIds: string[]) {
  const skip = (query.page - 1) * query.limit;
  const where = buildListWhereForCategoryIds(query, categoryIds);
  return prisma.machine.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    skip,
    take: query.limit,
    include: {
      translations: { where: { locale: query.locale } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: {
        include: {
          translations: { where: { locale: query.locale } },
        },
      },
    },
  });
}

export async function countMachinesForListInCategoryIds(
  query: MachinesListQuery,
  categoryIds: string[],
): Promise<number> {
  return prisma.machine.count({
    where: buildListWhereForCategoryIds(query, categoryIds),
  });
}

export async function findRelatedMachinesInCategoryIds(
  categoryIds: string[],
  excludeMachineId: string,
  locale: AppLocale,
  take: number,
) {
  return prisma.machine.findMany({
    where: {
      published: true,
      id: { not: excludeMachineId },
      categoryId: { in: categoryIds },
      translations: { some: { locale } },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take,
    include: {
      translations: { where: { locale } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: {
        include: {
          translations: { where: { locale } },
        },
      },
    },
  });
}

/** Scan cap when picking a category card cover from machines (gallery or OG image). */
const CATEGORY_COVER_MACHINE_SCAN_LIMIT = 200;

export async function findFirstPublishedMachineCoverInCategoryIds(
  categoryIds: string[],
  locale: AppLocale,
): Promise<{ url: string; alt: string | null; sortOrder: number } | null> {
  const machines = await prisma.machine.findMany({
    where: {
      published: true,
      categoryId: { in: categoryIds },
      translations: { some: { locale } },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: CATEGORY_COVER_MACHINE_SCAN_LIMIT,
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      translations: { where: { locale } },
    },
  });

  for (const machine of machines) {
    const tr = machine.translations[0];
    const img = machine.images[0];
    if (img?.url?.trim()) {
      return { url: img.url, alt: img.alt, sortOrder: img.sortOrder };
    }
    const og = tr?.ogImageUrl?.trim();
    if (og && og.length > 0) {
      return { url: og, alt: tr.title, sortOrder: 0 };
    }
  }
  return null;
}

export async function listMachineTranslationSlugs(machineId: string) {
  return prisma.machineTranslation.findMany({
    where: { machineId },
    select: { locale: true, slug: true },
  });
}

export async function listCategoryTranslationSlugs(categoryId: string) {
  return prisma.machineCategoryTranslation.findMany({
    where: { categoryId },
    select: { locale: true, slug: true },
  });
}

export async function findMachineDetailBySlug(slug: string, locale: AppLocale) {
  return prisma.machineTranslation.findFirst({
    where: {
      locale,
      slug,
      machine: { published: true },
    },
    include: {
      machine: {
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          category: {
            include: {
              translations: { where: { locale } },
            },
          },
        },
      },
    },
  });
}

export type MachineListRow = Awaited<ReturnType<typeof findMachinesForList>>[number];

type DetailLookup = Awaited<ReturnType<typeof findMachineDetailBySlug>>;
export type MachineTranslationDetailRow = Exclude<DetailLookup, null>;
