"use client";

import { useAdminMessages } from "@/features/admin/admin-messages.context";
import type { AdminTheme } from "@/features/admin/admin-theme.constants";
import { AdminOgImagePreview } from "@/features/admin/admin-og-image-preview.client";
import { uploadImageToR2, type R2UploadScopeUi } from "@/features/admin/admin-upload.client";
import {
  adminButtonDeleteExtraClass,
  adminButtonSecondaryClass,
  adminCheckboxClass,
  adminCheckboxLabelClass,
  adminGalleryRowShellClass,
  adminInputClass,
  adminLabelClass,
} from "@/features/admin/admin-ui.constants";

export type GalleryImageRow = {
  url: string;
  alt: string | null;
  sortOrder: number;
  /** Product gallery: mark the hero / OG image. Omitted for blog. */
  isPrimary?: boolean;
};

function ensurePrimaryWhenMissing(rows: GalleryImageRow[], showPrimary: boolean): GalleryImageRow[] {
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

type AdminGalleryImageRowsProps = {
  readonly theme: AdminTheme;
  readonly images: GalleryImageRow[];
  readonly onImagesChange: (next: GalleryImageRow[]) => void;
  readonly uploadScope: R2UploadScopeUi;
  readonly uploadBusy: boolean;
  readonly onUploadBusyChange: (busy: boolean) => void;
  readonly reportError: (message: string | null) => void;
  /** When true (products), show a single “primary” radio per row. */
  readonly showPrimary?: boolean;
};

export function AdminGalleryImageRows({
  theme,
  images,
  onImagesChange,
  uploadScope,
  uploadBusy,
  onUploadBusyChange,
  reportError,
  showPrimary = false,
}: AdminGalleryImageRowsProps) {
  const m = useAdminMessages();
  const lab = adminLabelClass(theme);
  const inC = adminInputClass(theme);
  const sec = adminButtonSecondaryClass(theme);
  const rowShell = adminGalleryRowShellClass(theme);

  const addRow = () => {
    const nextPrimary = showPrimary && images.length === 0;
    onImagesChange([
      ...images,
      {
        url: "",
        alt: "",
        sortOrder: images.length,
        ...(showPrimary ? { isPrimary: nextPrimary } : {}),
      },
    ]);
  };

  const setPrimary = (idx: number) => {
    if (!showPrimary) {
      return;
    }
    const next = images.map((img, i) => ({ ...img, isPrimary: i === idx }));
    onImagesChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={lab}>{m.gallery.heading}</span>
        <div className="flex flex-wrap gap-2">
          <label className={`${sec} cursor-pointer`}>
            <input
              accept="image/*"
              className="sr-only"
              disabled={uploadBusy}
              multiple
              onChange={(e) => {
                const files = e.target.files ? Array.from(e.target.files) : [];
                e.target.value = "";
                if (files.length === 0) {
                  return;
                }
                void (async () => {
                  onUploadBusyChange(true);
                  reportError(null);
                  try {
                    let next = [...images];
                    for (const f of files) {
                      const url = await uploadImageToR2(f, uploadScope);
                      next.push({
                        url,
                        alt: "",
                        sortOrder: next.length,
                        ...(showPrimary ? { isPrimary: false } : {}),
                      });
                    }
                    onImagesChange(ensurePrimaryWhenMissing(next, showPrimary));
                  } catch (err) {
                    reportError(err instanceof Error ? err.message : m.common.uploadFailed);
                  } finally {
                    onUploadBusyChange(false);
                  }
                })();
              }}
              type="file"
            />
            {m.gallery.uploadMultiple}
          </label>
          <button className={sec} onClick={addRow} type="button">
            {m.gallery.addRow}
          </button>
        </div>
      </div>
      {images.map((img, idx) => (
        <div className="space-y-2" key={idx}>
          <div className={rowShell}>
            <div className="min-w-0 flex-1">
              <label className={lab}>{m.gallery.url}</label>
              <input
                className={inC}
                onChange={(e) => {
                  const next = [...images];
                  next[idx] = { ...next[idx], url: e.target.value };
                  onImagesChange(next);
                }}
                value={img.url}
              />
            </div>
            <div className="w-full sm:w-40">
              <label className={lab}>{m.gallery.alt}</label>
              <input
                className={inC}
                onChange={(e) => {
                  const next = [...images];
                  next[idx] = { ...next[idx], alt: e.target.value };
                  onImagesChange(next);
                }}
                value={img.alt ?? ""}
              />
            </div>
            {showPrimary ? (
              <label className={`${adminCheckboxLabelClass(theme)} shrink-0 self-end`}>
                <input
                  checked={img.isPrimary === true}
                  className={adminCheckboxClass(theme)}
                  name="machine-gallery-primary"
                  onChange={() => {
                    setPrimary(idx);
                  }}
                  type="radio"
                />
                {m.gallery.primary}
              </label>
            ) : null}
            <label className={`${sec} shrink-0 cursor-pointer self-end text-center`}>
              <input
                accept="image/*"
                className="sr-only"
                disabled={uploadBusy}
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (!f) {
                    return;
                  }
                  onUploadBusyChange(true);
                  reportError(null);
                  try {
                    const url = await uploadImageToR2(f, uploadScope);
                    const next = [...images];
                    next[idx] = { ...next[idx], url };
                    onImagesChange(ensurePrimaryWhenMissing(next, showPrimary));
                  } catch (err) {
                    reportError(err instanceof Error ? err.message : m.common.uploadFailed);
                  } finally {
                    onUploadBusyChange(false);
                  }
                }}
                type="file"
              />
              {m.gallery.upload}
            </label>
            <button
              className={`${sec} shrink-0 self-end ${adminButtonDeleteExtraClass(theme)}`}
              onClick={() => {
                const filtered = images.filter((_, i) => i !== idx);
                if (showPrimary && filtered.length > 0 && !filtered.some((i) => i.isPrimary)) {
                  filtered[0] = { ...filtered[0], isPrimary: true };
                }
                onImagesChange(filtered);
              }}
              type="button"
            >
              {m.gallery.remove}
            </button>
          </div>
          <AdminOgImagePreview theme={theme} url={img.url} />
        </div>
      ))}
    </div>
  );
}
