import type { MachineCategoryBriefDto, MachineDetailDto, MachineListItemDto } from "@/features/machines/machines.dto";
import type { MachineListRow, MachineTranslationDetailRow } from "@/features/machines/machines.repository";
import { normalizeStoredImageUrl } from "@/lib/image/remote-image-url";

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
  const ogTrimmed = tr.ogImageUrl?.trim() ?? "";
  const fromGallery =
    img && normalizeStoredImageUrl(img.url).trim().length > 0
      ? { url: normalizeStoredImageUrl(img.url), alt: img.alt, sortOrder: img.sortOrder }
      : null;
  const coverImage =
    fromGallery ??
    (ogTrimmed.length > 0
      ? { url: normalizeStoredImageUrl(ogTrimmed), alt: tr.title, sortOrder: 0 }
      : null);

  return {
    id: row.id,
    slug: tr.slug,
    title: tr.title,
    shortDescription: tr.shortDescription,
    featured: row.featured,
    category: mapCategoryBrief(row.category),
    coverImage,
  };
}

export function mapMachineDetailRow(row: MachineTranslationDetailRow): MachineDetailDto {
  const { machine } = row;
  const mappedImages = machine.images
    .map((i) => ({
      url: normalizeStoredImageUrl(i.url),
      alt: i.alt,
      sortOrder: i.sortOrder,
    }))
    .filter((i) => i.url.trim().length > 0);

  const ogTrimmed = row.ogImageUrl?.trim() ?? "";
  const images =
    mappedImages.length > 0
      ? mappedImages
      : ogTrimmed.length > 0
        ? [
            {
              url: normalizeStoredImageUrl(ogTrimmed),
              alt: row.title,
              sortOrder: 0,
            },
          ]
        : [];

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
    images,
  };
}
