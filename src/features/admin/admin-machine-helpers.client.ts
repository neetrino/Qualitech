import type { MachineCategoryAdminRow } from "@/features/admin/admin-api-types.client";

export function categoryLabelForAdminSelect(c: MachineCategoryAdminRow): string {
  const en = c.translations.find((x) => x.locale === "en");
  const ru = c.translations.find((x) => x.locale === "ru");
  if (en && ru) {
    return `${en.name} (${ru.name})`;
  }
  return en?.name ?? ru?.name ?? c.id;
}

export function machineCategoryOptionsFromApi(
  categories: MachineCategoryAdminRow[],
): { id: string; label: string }[] {
  return categories.map((c) => ({ id: c.id, label: categoryLabelForAdminSelect(c) }));
}
