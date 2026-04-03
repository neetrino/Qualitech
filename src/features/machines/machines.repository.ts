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
