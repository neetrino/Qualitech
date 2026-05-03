import { AppLocale } from "@prisma/client";
import { unstable_cache } from "next/cache";

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
import {
  MACHINE_CATEGORY_PUBLIC_CACHE_TAG,
  MACHINES_PUBLIC_DATA_REVALIDATE_SEC,
  RELATED_MACHINES_CAROUSEL_LIMIT,
} from "@/features/machines/machines.constants";
import {
  collectDescendantCategoryIds,
  countMachinesForList,
  countMachinesForListInCategoryIds,
  findFirstPublishedMachineCoverInCategoryIds,
  findMachineCategoryTranslationBySlug,
  findMachineDetailBySlug,
  findPublishedMachineCategorySlug,
  findMachinesForList,
  findMachinesForListInCategoryIds,
  findRelatedMachinesInCategoryIds,
  findTopLevelMachineCategories,
  listCategoryTranslationSlugs,
} from "@/features/machines/machines.repository";
import type { MachinesListQuery } from "@/features/machines/machines.schemas";
import { normalizeStoredImageUrl } from "@/lib/image/remote-image-url";

const DESCENDANT_IDS_CACHE_TTL_MS = MACHINES_PUBLIC_DATA_REVALIDATE_SEC * 1000;
const descendantIdsCache = new Map<string, { expiresAt: number; ids: string[] }>();

function localeKey(loc: AppLocale): HomeLocale {
  return loc === AppLocale.en ? "en" : "ru";
}

async function getDescendantCategoryIdsCached(rootId: string): Promise<string[]> {
  const now = Date.now();
  const hit = descendantIdsCache.get(rootId);
  if (hit && hit.expiresAt > now) {
    return hit.ids;
  }
  const ids = await collectDescendantCategoryIds(rootId);
  descendantIdsCache.set(rootId, { ids, expiresAt: now + DESCENDANT_IDS_CACHE_TTL_MS });
  return ids;
}

export async function listMachinesPublic(query: MachinesListQuery): Promise<MachinesListResult> {
  const cached = unstable_cache(
    async () => {
      const [total, rows] = await Promise.all([countMachinesForList(query), findMachinesForList(query)]);
      return {
        data: rows.map(mapMachineListRow),
        meta: { page: query.page, limit: query.limit, total },
      };
    },
    [
      "machines-list",
      query.locale,
      query.categorySlug ?? "",
      query.featured === undefined ? "all" : String(query.featured),
      String(query.page),
      String(query.limit),
    ],
    { revalidate: MACHINES_PUBLIC_DATA_REVALIDATE_SEC },
  );
  return cached();
}

export async function getPublishedMachineCategorySlugForMachine(
  machineId: string,
  locale: AppLocale,
): Promise<string | null> {
  return findPublishedMachineCategorySlug(machineId, locale);
}

export async function getMachineBySlugPublic(
  slug: string,
  locale: AppLocale,
): Promise<MachineDetailDto | null> {
  const cached = unstable_cache(
    async () => {
      const row = await findMachineDetailBySlug(slug, locale);
      if (!row) {
        return null;
      }
      return mapMachineDetailRow(row);
    },
    ["machine-detail", locale, slug],
    { revalidate: MACHINES_PUBLIC_DATA_REVALIDATE_SEC },
  );
  return cached();
}

/** Uncached (e.g. after admin edits, or to avoid stale `null` in the detail-page fallback path). */
export async function getMachineBySlugPublicUncached(
  slug: string,
  locale: AppLocale,
): Promise<MachineDetailDto | null> {
  const row = await findMachineDetailBySlug(slug, locale);
  if (!row) {
    return null;
  }
  return mapMachineDetailRow(row);
}

type TopLevelCategoryRow = Awaited<ReturnType<typeof findTopLevelMachineCategories>>[number];

async function mapTopLevelCategoryRowsToCards(
  rows: TopLevelCategoryRow[],
  locale: AppLocale,
): Promise<MachineCategoryCardDto[]> {
  const cardsOrNull = await Promise.all(
    rows.map(async (row): Promise<MachineCategoryCardDto | null> => {
      const tr = row.translations[0];
      if (!tr) {
        return null;
      }
      const ids = await getDescendantCategoryIdsCached(row.id);
      const customCover =
        row.imageUrl != null && row.imageUrl.trim().length > 0
          ? {
              url: normalizeStoredImageUrl(row.imageUrl),
              alt: null as string | null,
              sortOrder: 0,
              isPrimary: true,
            }
          : null;
      const fallbackCover = await findFirstPublishedMachineCoverInCategoryIds(ids, locale);
      const cover =
        customCover ??
        (fallbackCover ? { ...fallbackCover, url: normalizeStoredImageUrl(fallbackCover.url) } : null);
      return {
        slug: tr.slug,
        name: tr.name,
        coverImage: cover,
        homeDescription: tr.homeDescription?.trim() ? tr.homeDescription.trim() : null,
        homeBullets: Array.isArray(tr.homeBullets)
          ? tr.homeBullets.map((b) => b.trim()).filter((b) => b.length > 0)
          : [],
      };
    }),
  );
  return cardsOrNull.filter((card): card is MachineCategoryCardDto => card !== null);
}

/** All top-level sections for `/machines` catalog grid. */
export async function listTopLevelMachineCategoryCardsPublic(
  locale: AppLocale,
): Promise<MachineCategoryCardDto[]> {
  const cached = unstable_cache(
    async () => {
      const rows = await findTopLevelMachineCategories(locale);
      return mapTopLevelCategoryRowsToCards(rows, locale);
    },
    ["machines-top-level-category-cards", locale],
    { revalidate: MACHINES_PUBLIC_DATA_REVALIDATE_SEC, tags: [MACHINE_CATEGORY_PUBLIC_CACHE_TAG] },
  );
  return cached();
}

/** Top-level sections marked for home #solutions (same card mapping; ordered by `sortOrder`). */
export async function listHomeFeaturedMachineCategoryCardsPublic(
  locale: AppLocale,
): Promise<MachineCategoryCardDto[]> {
  const cached = unstable_cache(
    async () => {
      const rows = await findTopLevelMachineCategories(locale, { homeSolutionsOnly: true });
      return mapTopLevelCategoryRowsToCards(rows, locale);
    },
    ["home-featured-machine-category-cards", locale],
    { revalidate: MACHINES_PUBLIC_DATA_REVALIDATE_SEC, tags: [MACHINE_CATEGORY_PUBLIC_CACHE_TAG] },
  );
  return cached();
}

export async function getMachineCategorySectionPublic(
  sectionSlug: string,
  locale: AppLocale,
): Promise<MachineCategorySectionContextDto | null> {
  const cached = unstable_cache(
    async () => {
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
    },
    ["machine-category-section", locale, sectionSlug],
    { revalidate: MACHINES_PUBLIC_DATA_REVALIDATE_SEC },
  );
  return cached();
}

export async function listMachinesInCategorySectionPublic(
  sectionSlug: string,
  query: MachinesListQuery,
): Promise<MachinesListResult | null> {
  const cached = unstable_cache(
    async () => {
      const cat = await findMachineCategoryTranslationBySlug(sectionSlug, query.locale);
      if (!cat) {
        return null;
      }
      const ids = await getDescendantCategoryIdsCached(cat.categoryId);
      const [total, rows] = await Promise.all([
        countMachinesForListInCategoryIds(query, ids),
        findMachinesForListInCategoryIds(query, ids),
      ]);
      return {
        data: rows.map(mapMachineListRow),
        meta: { page: query.page, limit: query.limit, total },
      };
    },
    [
      "machines-list-by-section",
      query.locale,
      sectionSlug,
      query.featured === undefined ? "all" : String(query.featured),
      String(query.page),
      String(query.limit),
    ],
    { revalidate: MACHINES_PUBLIC_DATA_REVALIDATE_SEC },
  );
  return cached();
}

export async function listRelatedMachinesInSectionPublic(
  sectionSlug: string,
  excludeMachineId: string,
  locale: AppLocale,
): Promise<MachineListItemDto[]> {
  const cached = unstable_cache(
    async () => {
      const cat = await findMachineCategoryTranslationBySlug(sectionSlug, locale);
      if (!cat) {
        return [];
      }
      const ids = await getDescendantCategoryIdsCached(cat.categoryId);
      const rows = await findRelatedMachinesInCategoryIds(ids, excludeMachineId, locale, RELATED_MACHINES_CAROUSEL_LIMIT);
      return rows.map(mapMachineListRow);
    },
    ["related-machines-in-section", locale, sectionSlug, excludeMachineId],
    { revalidate: MACHINES_PUBLIC_DATA_REVALIDATE_SEC },
  );
  return cached();
}

async function loadMachineDetailForSection(
  machineSlug: string,
  sectionSlug: string,
  locale: AppLocale,
): Promise<MachineDetailWithLocaleSlugs | null> {
  const section = await findMachineCategoryTranslationBySlug(sectionSlug, locale);
  if (!section) {
    return null;
  }
  const descendantIds = await getDescendantCategoryIdsCached(section.categoryId);
  const row = await findMachineDetailBySlug(machineSlug, locale);
  if (!row) {
    return null;
  }
  const cid = row.machine.categoryId;
  if (!cid || !descendantIds.includes(cid)) {
    return null;
  }
  const detail = mapMachineDetailRow(row);
  const cTr = await listCategoryTranslationSlugs(section.categoryId);
  const sharedSlug = row.machine.slug;
  const slugByLocale: Partial<Record<HomeLocale, string>> = {
    en: sharedSlug,
    ru: sharedSlug,
  };
  const sectionSlugByLocale: Partial<Record<HomeLocale, string>> = {};
  for (const t of cTr) {
    sectionSlugByLocale[localeKey(t.locale)] = t.slug;
  }
  return { detail, slugByLocale, sectionSlugByLocale };
}

/** Uncached load (e.g. after correcting a bad section slug in URL). */
export async function getMachineDetailForSectionPublicUncached(
  machineSlug: string,
  sectionSlug: string,
  locale: AppLocale,
): Promise<MachineDetailWithLocaleSlugs | null> {
  return loadMachineDetailForSection(machineSlug, sectionSlug, locale);
}

export async function getMachineDetailForSectionPublic(
  machineSlug: string,
  sectionSlug: string,
  locale: AppLocale,
): Promise<MachineDetailWithLocaleSlugs | null> {
  const cached = unstable_cache(
    () => loadMachineDetailForSection(machineSlug, sectionSlug, locale),
    ["machine-detail-for-section", locale, sectionSlug, machineSlug],
    { revalidate: MACHINES_PUBLIC_DATA_REVALIDATE_SEC },
  );
  return cached();
}
