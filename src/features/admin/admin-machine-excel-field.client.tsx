"use client";

import { useRef, type ChangeEvent } from "react";

import { useAdminMessages } from "@/features/admin/admin-messages.context";
import type { AdminTheme } from "@/features/admin/admin-theme.constants";
import { uploadExcelToR2 } from "@/features/admin/admin-upload.client";
import {
  adminButtonSecondaryClass,
  adminHintTextClass,
  adminLabelClass,
} from "@/features/admin/admin-ui.constants";

type AdminMachineExcelFieldProps = {
  readonly theme: AdminTheme;
  readonly excelUrl: string;
  readonly onExcelUrlChange: (next: string) => void;
  readonly uploadBusy: boolean;
  readonly onUploadBusyChange: (busy: boolean) => void;
  readonly reportError: (message: string | null) => void;
};

export function AdminMachineExcelField({
  theme,
  excelUrl,
  onExcelUrlChange,
  uploadBusy,
  onUploadBusyChange,
  reportError,
}: AdminMachineExcelFieldProps) {
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
        const url = await uploadExcelToR2(file, "machines");
        onExcelUrlChange(url);
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
      <div className="flex flex-wrap items-center gap-2">
        <input
          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
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
          {uploadBusy ? m.machineForm.excelUploading : m.machineForm.excelUpload}
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
    </div>
  );
}
