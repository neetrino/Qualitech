"use client";

import { useRef, type ChangeEvent } from "react";

import { AdminOgImagePreview } from "@/features/admin/admin-og-image-preview.client";
import { useAdminMessages } from "@/features/admin/admin-messages.context";
import type { AdminTheme } from "@/features/admin/admin-theme.constants";
import { uploadImageToR2 } from "@/features/admin/admin-upload.client";
import {
  adminButtonSecondaryClass,
  adminHintTextClass,
  adminLabelClass,
} from "@/features/admin/admin-ui.constants";
import { machineSheetUrlIsPdf } from "@/features/machines/machine-sheet-asset-url";

type AdminMachinePdfFieldProps = {
  readonly theme: AdminTheme;
  readonly pdfUrl: string;
  readonly onPdfUrlChange: (next: string) => void;
  readonly uploadBusy: boolean;
  readonly onUploadBusyChange: (busy: boolean) => void;
  readonly reportError: (message: string | null) => void;
};

export function AdminMachinePdfField({
  theme,
  pdfUrl,
  onPdfUrlChange,
  uploadBusy,
  onUploadBusyChange,
  reportError,
}: AdminMachinePdfFieldProps) {
  const m = useAdminMessages();
  const inputRef = useRef<HTMLInputElement>(null);
  const lab = adminLabelClass(theme);
  const sec = adminButtonSecondaryClass(theme);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) {
      return;
    }
    void (async () => {
      onUploadBusyChange(true);
      reportError(null);
      try {
        const url = await uploadImageToR2(file, "machines");
        onPdfUrlChange(url);
      } catch (err) {
        reportError(err instanceof Error ? err.message : m.common.uploadFailed);
      } finally {
        onUploadBusyChange(false);
      }
    })();
  };

  return (
    <div className="space-y-2">
      <span className={lab}>{m.machineForm.pdfSheet}</span>
      <p className={adminHintTextClass(theme)}>{m.machineForm.pdfHint}</p>
      <div className="flex flex-wrap items-center gap-2">
        <input
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.jpg,.jpeg,.png,.webp,.gif,.svg"
          className="sr-only"
          onChange={onFileChange}
          ref={inputRef}
          type="file"
        />
        <button
          className={sec}
          disabled={uploadBusy}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          {uploadBusy ? m.machineForm.pdfUploading : m.machineForm.pdfUpload}
        </button>
        {pdfUrl.trim().length > 0 ? (
          <button
            className={sec}
            onClick={() => onPdfUrlChange("")}
            type="button"
          >
            {m.machineForm.pdfRemove}
          </button>
        ) : null}
      </div>
      {pdfUrl.trim().length > 0 ? (
        <div className="space-y-2">
          {machineSheetUrlIsPdf(pdfUrl) ? null : (
            <AdminOgImagePreview theme={theme} url={pdfUrl} variant="galleryCard" />
          )}
          <p className={theme === "light" ? "text-xs text-zinc-600" : "text-xs text-zinc-400"}>
            <a className="underline" href={pdfUrl.trim()} rel="noopener noreferrer" target="_blank">
              {m.machineForm.pdfOpen}
            </a>
          </p>
        </div>
      ) : null}
    </div>
  );
}
