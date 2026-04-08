export type GalleryImageRow = {
  url: string;
  alt: string | null;
  sortOrder: number;
  /** Product gallery: mark the hero / OG image. Omitted for blog. */
  isPrimary?: boolean;
};

/** Ensures at most one primary; if gallery has URLs, first row is primary when none set. */
export function ensurePrimaryWhenMissing(rows: GalleryImageRow[], showPrimary: boolean): GalleryImageRow[] {
  if (!showPrimary) {
    return rows;
  }
  const hasPrimary = rows.some((r) => r.isPrimary === true && r.url.trim().length > 0);
  if (hasPrimary) {
    return rows;
  }
  const firstWithUrl = rows.findIndex((r) => r.url.trim().length > 0);
  if (firstWithUrl < 0) {
    return rows;
  }
  return rows.map((r, i) => ({ ...r, isPrimary: i === firstWithUrl }));
}
