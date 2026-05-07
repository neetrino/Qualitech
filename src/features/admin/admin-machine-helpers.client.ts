import type { MachineCategoryAdminRow } from "@/features/admin/admin-api-types.client";
import type { HomeLocale } from "@/features/home/home.messages";

function localizedCategoryName(c: MachineCategoryAdminRow, locale: HomeLocale): string {
  const selected = c.translations.find((x) => x.locale === locale)?.name?.trim();
  if (selected && selected.length > 0) {
    return selected;
  }
  const fallbackLocale: HomeLocale = locale === "ru" ? "en" : "ru";
  const fallback = c.translations.find((x) => x.locale === fallbackLocale)?.name?.trim();
  if (fallback && fallback.length > 0) {
    return fallback;
  }
  const first = c.translations.find((x) => x.name.trim().length > 0)?.name.trim();
  return first ?? c.id;
}

export function categoryLabelForAdminSelect(c: MachineCategoryAdminRow, locale: HomeLocale): string {
  return localizedCategoryName(c, locale);
}

export function machineCategoryOptionsFromApi(
  categories: MachineCategoryAdminRow[],
  locale: HomeLocale,
): { id: string; label: string }[] {
  return categories.map((c) => ({ id: c.id, label: categoryLabelForAdminSelect(c, locale) }));
}
