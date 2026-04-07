"use client";

import { useAdminMessages } from "@/features/admin/admin-messages.context";
import type { AdminTheme } from "@/features/admin/admin-theme.constants";
import { uploadImageToR2, type R2UploadScopeUi } from "@/features/admin/admin-upload.client";
import {
  adminButtonDeleteExtraClass,
  adminButtonSecondaryClass,
  adminGalleryRowShellClass,
  adminInputClass,
  adminLabelClass,
} from "@/features/admin/admin-ui.constants";

export type GalleryImageRow = {
  url: string;
  alt: string | null;
  sortOrder: number;
};

type AdminGalleryImageRowsProps = {
  readonly theme: AdminTheme;
  readonly images: GalleryImageRow[];
  readonly onImagesChange: (next: GalleryImageRow[]) => void;
  readonly uploadScope: R2UploadScopeUi;
  readonly uploadBusy: boolean;
  readonly onUploadBusyChange: (busy: boolean) => void;
  readonly reportError: (message: string | null) => void;
};

export function AdminGalleryImageRows({
  theme,
  images,
  onImagesChange,
  uploadScope,
  uploadBusy,
  onUploadBusyChange,
  reportError,
}: AdminGalleryImageRowsProps) {
  const m = useAdminMessages();
  const lab = adminLabelClass(theme);
  const inC = adminInputClass(theme);
  const sec = adminButtonSecondaryClass(theme);
  const rowShell = adminGalleryRowShellClass(theme);

  const addRow = () => {
    onImagesChange([...images, { url: "", alt: "", sortOrder: images.length }]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className={lab}>{m.gallery.heading}</span>
        <button className={sec} onClick={addRow} type="button">
          {m.gallery.addRow}
        </button>
      </div>
      {images.map((img, idx) => (
        <div className={rowShell} key={idx}>
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
          <label className={`${sec} shrink-0 cursor-pointer`}>
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
                  onImagesChange(next);
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
            className={`${sec} shrink-0 ${adminButtonDeleteExtraClass(theme)}`}
            onClick={() => onImagesChange(images.filter((_, i) => i !== idx))}
            type="button"
          >
            {m.gallery.remove}
          </button>
        </div>
      ))}
    </div>
  );
}
