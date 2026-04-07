import { AppLocale } from "@prisma/client";

import type { HomeLocale } from "@/features/home/home.messages";
import type {
  MachineCategoryCardDto,
  MachineCategorySectionContextDto,
  MachineDetailDto,
  MachineDetailWithLocaleSlugs,
  MachineListItemDto,
  MachinesListResult,
} from "@/features/machines/machines.dto";
import { mapMachineDetailRow, mapMachineListRow } from "@/features/machines/machines.mappers";
import { RELATED_MACHINES_CAROUSEL_LIMIT } from "@/features/machines/machines.constants";
import {
  collectDescendantCategoryIds,
  countMachinesForList,
  countMachinesForListInCategoryIds,
  findFirstPublishedMachineCoverInCategoryIds,
  findMachineCategoryTranslationBySlug,
  findMachineDetailBySlug,
  findMachinesForList,
  findMachinesForListInCategoryIds,
  findRelatedMachinesInCategoryIds,
  findTopLevelMachineCategories,
  listCategoryTranslationSlugs,
  listMachineTranslationSlugs,
} from "@/features/machines/machines.repository";
import type { MachinesListQuery } from "@/features/machines/machines.schemas";
import { normalizeStoredImageUrl } from "@/lib/image/remote-image-url";

function localeKey(loc: AppLocale): HomeLocale {
  return loc === AppLocale.en ? "en" : "ru";
}

export async function listMachinesPublic(query: MachinesListQuery): Promise<MachinesListResult> {
  const [total, rows] = await Promise.all([countMachinesForList(query), findMachinesForList(query)]);
  return {
    data: rows.map(mapMachineListRow),
    meta: { page: query.page, limit: query.limit, total },
  };
}

export async function getMachineBySlugPublic(
  slug: string,
  locale: AppLocale,
): Promise<MachineDetailDto | null> {
  const row = await findMachineDetailBySlug(slug, locale);
  if (!row) {
    return null;
  }
  return mapMachineDetailRow(row);
}

export async function listTopLevelMachineCategoryCardsPublic(
  locale: AppLocale,
): Promise<MachineCategoryCardDto[]> {
  const rows = await findTopLevelMachineCategories(locale);
  const result: MachineCategoryCardDto[] = [];
  for (const row of rows) {
    const tr = row.translations[0];
    if (!tr) {
      continue;
    }
    const ids = await collectDescendantCategoryIds(row.id);
    const customCover =
      row.imageUrl != null && row.imageUrl.trim().length > 0
        ? { url: normalizeStoredImageUrl(row.imageUrl), alt: null as string | null, sortOrder: 0 }
        : null;
    const fallbackCover = await findFirstPublishedMachineCoverInCategoryIds(ids, locale);
    const cover =
      customCover ??
      (fallbackCover
        ? { ...fallbackCover, url: normalizeStoredImageUrl(fallbackCover.url) }
        : null);
    result.push({
      slug: tr.slug,
      name: tr.name,
      coverImage: cover,
    });
  }
  return result;
}

export async function getMachineCategorySectionPublic(
  sectionSlug: string,
  locale: AppLocale,
): Promise<MachineCategorySectionContextDto | null> {
  const row = await findMachineCategoryTranslationBySlug(sectionSlug, locale);
  if (!row) {
    return null;
  }
  const slugs = await listCategoryTranslationSlugs(row.categoryId);
  const slugByLocale: Partial<Record<HomeLocale, string>> = {};
  for (const t of slugs) {
    slugByLocale[localeKey(t.locale)] = t.slug;
  }
  return { name: row.name, slugByLocale };
}

export async function listMachinesInCategorySectionPublic(
  sectionSlug: string,
  query: MachinesListQuery,
): Promise<MachinesListResult | null> {
  const cat = await findMachineCategoryTranslationBySlug(sectionSlug, query.locale);
  if (!cat) {
    return null;
  }
  const ids = await collectDescendantCategoryIds(cat.categoryId);
  const [total, rows] = await Promise.all([
    countMachinesForListInCategoryIds(query, ids),
    findMachinesForListInCategoryIds(query, ids),
  ]);
  return {
    data: rows.map(mapMachineListRow),
    meta: { page: query.page, limit: query.limit, total },
  };
}

export async function listRelatedMachinesInSectionPublic(
  sectionSlug: string,
  excludeMachineId: string,
  locale: AppLocale,
): Promise<MachineListItemDto[]> {
  const cat = await findMachineCategoryTranslationBySlug(sectionSlug, locale);
  if (!cat) {
    return [];
  }
  const ids = await collectDescendantCategoryIds(cat.categoryId);
  const rows = await findRelatedMachinesInCategoryIds(ids, excludeMachineId, locale, RELATED_MACHINES_CAROUSEL_LIMIT);
  return rows.map(mapMachineListRow);
}

export async function getMachineDetailForSectionPublic(
  machineSlug: string,
  sectionSlug: string,
  locale: AppLocale,
): Promise<MachineDetailWithLocaleSlugs | null> {
  const section = await findMachineCategoryTranslationBySlug(sectionSlug, locale);
  if (!section) {
    return null;
  }
  const descendantIds = await collectDescendantCategoryIds(section.categoryId);
  const row = await findMachineDetailBySlug(machineSlug, locale);
  if (!row) {
    return null;
  }
  const cid = row.machine.categoryId;
  if (!cid || !descendantIds.includes(cid)) {
    return null;
  }
  const detail = mapMachineDetailRow(row);
  const [mTr, cTr] = await Promise.all([
    listMachineTranslationSlugs(row.machine.id),
    listCategoryTranslationSlugs(section.categoryId),
  ]);
  const slugByLocale: Partial<Record<HomeLocale, string>> = {};
  for (const t of mTr) {
    slugByLocale[localeKey(t.locale)] = t.slug;
  }
  const sectionSlugByLocale: Partial<Record<HomeLocale, string>> = {};
  for (const t of cTr) {
    sectionSlugByLocale[localeKey(t.locale)] = t.slug;
  }
  return { detail, slugByLocale, sectionSlugByLocale };
}
