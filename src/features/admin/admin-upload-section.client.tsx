"use client";

import { useCallback, useId, useState, type ChangeEvent } from "react";

import { useAdminMessages } from "@/features/admin/admin-messages.context";
import type { AdminMessages } from "@/features/admin/admin.messages";
import { R2_ALLOWED_CONTENT_TYPES } from "@/features/admin/r2/r2.constants";
import { useAdminTheme } from "@/features/admin/admin-theme.context";
import { uploadImageToR2, type R2UploadScopeUi } from "@/features/admin/admin-upload.client";
import {
  adminButtonPrimaryClass,
  adminButtonSecondaryClass,
  adminCardPanelClass,
  adminCodeInlineClass,
  adminLabelClass,
  adminMonoMutedClass,
  adminOverviewProseClass,
  adminPanelHeadingClass,
  adminUploadResultBoxClass,
  adminUploadSelectClass,
} from "@/features/admin/admin-ui.constants";

const SCOPES: R2UploadScopeUi[] = ["blog", "machines"];

function scopeLabel(scope: R2UploadScopeUi, m: AdminMessages): string {
  return scope === "blog" ? m.uploadSection.scopeBlog : m.uploadSection.scopeMachines;
}

export function AdminUploadSectionClient() {
  const m = useAdminMessages();
  const { theme } = useAdminTheme();
  const pri = adminButtonPrimaryClass();
  const sec = adminButtonSecondaryClass(theme);
  const labelCls = adminLabelClass(theme);
  const card = adminCardPanelClass(theme);
  const h2 = adminPanelHeadingClass(theme);
  const prose = adminOverviewProseClass(theme);
  const code = adminCodeInlineClass(theme);
  const sel = adminUploadSelectClass(theme);
  const resultBox = adminUploadResultBoxClass(theme);
  const mono = adminMonoMutedClass(theme);

  const scopeId = useId();
  const [scope, setScope] = useState<R2UploadScopeUi>("blog");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);

  const onFile = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) {
        return;
      }
      setBusy(true);
      setError(null);
      setPublicUrl(null);
      try {
        const url = await uploadImageToR2(file, scope);
        setPublicUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : m.common.uploadFailed);
      } finally {
        setBusy(false);
      }
    },
    [m.common.uploadFailed, scope],
  );

  const errClass = theme === "light" ? "text-sm text-red-600" : "text-sm text-red-400";

  return (
    <div className={card}>
      <h2 className={h2}>{m.uploadSection.title}</h2>
      <p className={`mt-2 ${prose}`}>
        {m.uploadSection.introUses} <code className={code}>POST /api/admin/upload</code> {m.uploadSection.introThen}{" "}
        {R2_ALLOWED_CONTENT_TYPES.join(", ")}. {m.uploadSection.introMax}
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className={labelCls} htmlFor={scopeId}>
            {m.uploadSection.scopeLabel}
          </label>
          <select className={sel} id={scopeId} onChange={(e) => setScope(e.target.value as R2UploadScopeUi)} value={scope}>
            {SCOPES.map((s) => (
              <option key={s} value={s}>
                {scopeLabel(s, m)}
              </option>
            ))}
          </select>
        </div>

        <label className={`${pri} inline-block cursor-pointer`}>
          <input accept="image/*" className="sr-only" disabled={busy} onChange={(ev) => void onFile(ev)} type="file" />
          {busy ? m.uploadSection.uploading : m.uploadSection.chooseImage}
        </label>

        {error ? <p className={errClass}>{error}</p> : null}

        {publicUrl ? (
          <div className={resultBox}>
            <p className={labelCls}>{m.uploadSection.publicUrl}</p>
            <p className={mono}>{publicUrl}</p>
            <button className={`${sec} mt-3`} onClick={() => void navigator.clipboard.writeText(publicUrl)} type="button">
              {m.uploadSection.copyUrl}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
