import type { MachineCategoryBriefDto, MachineDetailDto, MachineListItemDto } from "@/features/machines/machines.dto";
import type { MachineListRow, MachineTranslationDetailRow } from "@/features/machines/machines.repository";

function mapCategoryBrief(category: MachineListRow["category"]): MachineCategoryBriefDto | null {
  const tr = category?.translations[0];
  if (!tr) {
    return null;
  }
  return { slug: tr.slug, name: tr.name };
}

export function mapMachineListRow(row: MachineListRow): MachineListItemDto {
  const tr = row.translations[0];
  if (!tr) {
    throw new Error("Invariant: published machine missing translation for locale");
  }
  const img = row.images[0];
  return {
    id: row.id,
    slug: tr.slug,
    title: tr.title,
    shortDescription: tr.shortDescription,
    featured: row.featured,
    category: mapCategoryBrief(row.category),
    coverImage: img
      ? { url: img.url, alt: img.alt, sortOrder: img.sortOrder }
      : null,
  };
}

export function mapMachineDetailRow(row: MachineTranslationDetailRow): MachineDetailDto {
  const { machine } = row;
  return {
    id: machine.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.shortDescription,
    body: row.body,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    ogImageUrl: row.ogImageUrl,
    featured: machine.featured,
    category: mapCategoryBrief(machine.category),
    images: machine.images.map((i) => ({
      url: i.url,
      alt: i.alt,
      sortOrder: i.sortOrder,
    })),
  };
}
