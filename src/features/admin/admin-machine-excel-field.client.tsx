"use client";

import { useRef, type ChangeEvent } from "react";

import { useAdminMessages } from "@/features/admin/admin-messages.context";
import type { AdminTheme } from "@/features/admin/admin-theme.constants";
import { uploadExcelToR2, uploadImageToR2 } from "@/features/admin/admin-upload.client";
import {
  adminButtonSecondaryClass,
  adminHintTextClass,
  adminLabelClass,
} from "@/features/admin/admin-ui.constants";

type AdminMachineExcelFieldProps = {
  readonly theme: AdminTheme;
  readonly excelUrl: string;
  readonly excelImageUrls: string[];
  readonly onExcelUrlChange: (next: string) => void;
  readonly onExcelImageUrlsChange: (next: string[]) => void;
  readonly uploadBusy: boolean;
  readonly onUploadBusyChange: (busy: boolean) => void;
  readonly reportError: (message: string | null) => void;
};

export function AdminMachineExcelField({
  theme,
  excelUrl,
  excelImageUrls,
  onExcelUrlChange,
  onExcelImageUrlsChange,
  uploadBusy,
  onUploadBusyChange,
  reportError,
}: AdminMachineExcelFieldProps) {
  const m = useAdminMessages();
  const excelInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
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
        const url = await uploadExcelToR2(file, "machines");
        onExcelUrlChange(url);
      } catch (err) {
        reportError(err instanceof Error ? err.message : m.common.uploadFailed);
      } finally {
        onUploadBusyChange(false);
      }
    })();
  };

  const onImageFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) {
      return;
    }
    void (async () => {
      onUploadBusyChange(true);
      reportError(null);
      try {
        const urls = await Promise.all(files.map((file) => uploadImageToR2(file, "machines")));
        const existing = new Set(excelImageUrls.map((url) => url.trim()).filter((url) => url.length > 0));
        const merged = [...excelImageUrls];
        for (const url of urls) {
          const trimmed = url.trim();
          if (trimmed.length > 0 && !existing.has(trimmed)) {
            merged.push(trimmed);
            existing.add(trimmed);
          }
        }
        onExcelImageUrlsChange(merged);
      } catch (err) {
        reportError(err instanceof Error ? err.message : m.common.uploadFailed);
      } finally {
        onUploadBusyChange(false);
      }
    })();
  };

  return (
    <div className="space-y-2">
      <span className={lab}>{m.machineForm.excelSheet}</span>
      <p className={adminHintTextClass(theme)}>{m.machineForm.excelHint}</p>
      <p className={adminHintTextClass(theme)}>{m.machineForm.excelImageAlternativeHint}</p>
      <div className="flex flex-wrap items-center gap-2">
        <input
          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          className="sr-only"
          onChange={onFileChange}
          ref={excelInputRef}
          type="file"
        />
        <input
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          className="sr-only"
          multiple
          onChange={onImageFilesChange}
          ref={imageInputRef}
          type="file"
        />
        <button
          className={sec}
          disabled={uploadBusy}
          onClick={() => excelInputRef.current?.click()}
          type="button"
        >
          {uploadBusy ? m.machineForm.excelUploading : m.machineForm.excelUpload}
        </button>
        <button
          className={sec}
          disabled={uploadBusy}
          onClick={() => imageInputRef.current?.click()}
          type="button"
        >
          {uploadBusy ? m.machineForm.excelUploading : m.machineForm.excelUploadImages}
        </button>
        {excelUrl.trim().length > 0 ? (
          <button className={sec} onClick={() => onExcelUrlChange("")} type="button">
            {m.machineForm.excelRemove}
          </button>
        ) : null}
      </div>
      {excelUrl.trim().length > 0 ? (
        <p className={theme === "light" ? "text-xs text-zinc-600" : "text-xs text-zinc-400"}>
          <a className="underline" href={excelUrl.trim()} rel="noopener noreferrer" target="_blank">
            {m.machineForm.excelOpen}
          </a>
        </p>
      ) : null}
      {excelImageUrls.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {excelImageUrls.map((url, idx) => (
            <div
              className={
                theme === "light"
                  ? "overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50"
                  : "overflow-hidden rounded-lg border border-white/10 bg-black/40"
              }
              key={`${url}-${idx}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- R2/CDN URL preview */}
              <img
                alt=""
                className="h-24 w-full object-cover"
                src={url}
              />
              <div className="p-2">
                <button
                  className={`${sec} w-full !px-2 !py-1.5`}
                  onClick={() =>
                    onExcelImageUrlsChange(excelImageUrls.filter((_, imageIdx) => imageIdx !== idx))
                  }
                  type="button"
                >
                  {m.gallery.remove}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
