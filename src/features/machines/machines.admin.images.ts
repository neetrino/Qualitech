import type { AdminMachineImageInput } from "@/features/machines/machines.admin.schemas";

/** Ensures at most one primary; if gallery has URLs, first row is primary when none set. */
export function normalizeMachineImagesForWrite(
  images: AdminMachineImageInput[],
): AdminMachineImageInput[] {
  const withUrl = images.filter((i) => i.url.trim().length > 0);
  if (withUrl.length === 0) {
    return [];
  }
  const primaryIndex = withUrl.findIndex((i) => i.isPrimary);
  const resolvedPrimary = primaryIndex >= 0 ? primaryIndex : 0;
  return withUrl.map((img, idx) => ({
    ...img,
    isPrimary: idx === resolvedPrimary,
    sortOrder: img.sortOrder ?? idx,
  }));
}
