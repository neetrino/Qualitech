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
import {
  ensurePrimaryWhenMissing,
  type GalleryImageRow,
} from "@/features/admin/admin-gallery.helpers";

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
  /** When true (machine gallery), URL/alt are managed via upload only — hide manual inputs. */
  readonly hideUrlAndAltFields?: boolean;
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
  hideUrlAndAltFields = false,
}: AdminGalleryImageRowsProps) {
  const m = useAdminMessages();
  const lab = adminLabelClass(theme);
  const inC = adminInputClass(theme);
  const sec = adminButtonSecondaryClass(theme);
  const rowShell = adminGalleryRowShellClass(theme);
  const chk = adminCheckboxClass(theme);
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

  const togglePrimaryCheckbox = (idx: number, checked: boolean) => {
    if (!showPrimary) {
      return;
    }
    if (checked) {
      setPrimary(idx);
      return;
    }
    const cleared = images.map((img, i) => ({
      ...img,
      isPrimary: i === idx ? false : !!img.isPrimary,
    }));
    onImagesChange(ensurePrimaryWhenMissing(cleared, true));
  };

  const runUploadFiles = (files: File[]) => {
    if (files.length === 0) {
      return;
    }
    void (async () => {
      onUploadBusyChange(true);
      reportError(null);
      try {
        const next = [...images];
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
  };

  if (hideUrlAndAltFields && showPrimary) {
    const cardShell =
      theme === "light"
        ? "w-44 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
        : "w-44 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/30";
    const overlayBar =
      "absolute bottom-0 left-0 right-0 flex items-center justify-between gap-2 bg-black/60 px-2 py-1.5 text-[11px] text-white";

    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={lab}>{m.gallery.heading}</span>
          <label className={`${sec} cursor-pointer`}>
            <input
              accept="image/*"
              className="sr-only"
              disabled={uploadBusy}
              multiple
              onChange={(e) => {
                const files = e.target.files ? Array.from(e.target.files) : [];
                e.target.value = "";
                runUploadFiles(files);
              }}
              type="file"
            />
            {m.gallery.upload}
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          {images.map((img, idx) => (
            <div className={cardShell} key={`${idx}-${img.url.slice(0, 48)}`}>
              <div className="relative">
                <AdminOgImagePreview theme={theme} url={img.url} variant="galleryCard" />
                <div className={overlayBar}>
                  <label className="flex cursor-pointer items-center gap-2 leading-tight">
                    <input
                      checked={img.isPrimary === true}
                      className={chk}
                      onChange={(e) => {
                        togglePrimaryCheckbox(idx, e.target.checked);
                      }}
                      type="checkbox"
                    />
                    <span className="text-white">{m.gallery.primary}</span>
                  </label>
                  <button
                    className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-red-200 hover:bg-white/10 hover:text-red-100"
                    onClick={() => {
                      const filtered = images.filter((_, i) => i !== idx);
                      if (filtered.length > 0 && !filtered.some((i) => i.isPrimary)) {
                        filtered[0] = { ...filtered[0], isPrimary: true };
                      }
                      onImagesChange(filtered);
                    }}
                    type="button"
                  >
                    {m.gallery.remove}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
                runUploadFiles(files);
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
            {hideUrlAndAltFields ? null : (
              <>
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
              </>
            )}
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
