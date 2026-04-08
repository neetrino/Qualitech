"use client";

import { AppLocale } from "@prisma/client";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import type { MachineCategoryAdminRow } from "@/features/admin/admin-api-types.client";
import { ADMIN_API_MACHINE_CATEGORIES_PATH } from "@/features/admin/admin.constants";
import { adminApiJson, formatAdminValidationError } from "@/features/admin/admin-http.client";
import { AdminOgImagePreview } from "@/features/admin/admin-og-image-preview.client";
import { useAdminMessages } from "@/features/admin/admin-messages.context";
import { useAdminTheme } from "@/features/admin/admin-theme.context";
import { uploadImageToR2 } from "@/features/admin/admin-upload.client";
import {
  adminButtonPrimaryClass,
  adminButtonSecondaryClass,
  adminFormSectionTitleClass,
  adminInputClass,
  adminLabelClass,
} from "@/features/admin/admin-ui.constants";

type AdminMachineCategoryFormClientProps = {
  readonly category: MachineCategoryAdminRow | null;
  readonly onCancel: () => void;
  readonly onSaved: () => void;
};

type TrForm = { name: string; slug: string };

function emptyTr(): TrForm {
  return { name: "", slug: "" };
}

export function AdminMachineCategoryFormClient({ category, onCancel, onSaved }: AdminMachineCategoryFormClientProps) {
  const m = useAdminMessages();
  const { theme } = useAdminTheme();
  const pri = adminButtonPrimaryClass();
  const sec = adminButtonSecondaryClass(theme);
  const labelCls = adminLabelClass(theme);
  const inputCls = adminInputClass(theme);
  const formTitle = adminFormSectionTitleClass(theme);

  const [sortOrder, setSortOrder] = useState(String(category?.sortOrder ?? 0));
  const [imageUrl, setImageUrl] = useState(category?.imageUrl ?? "");
  const [ru, setRu] = useState<TrForm>(emptyTr);
  const [en, setEn] = useState<TrForm>(emptyTr);
  const [busy, setBusy] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) {
      setRu(emptyTr());
      setEn(emptyTr());
      setSortOrder("0");
      setImageUrl("");
      return;
    }
    const trRu = category.translations.find((t) => t.locale === "ru");
    const trEn = category.translations.find((t) => t.locale === "en");
    setRu({ name: trRu?.name ?? "", slug: trRu?.slug ?? "" });
    setEn({ name: trEn?.name ?? "", slug: trEn?.slug ?? "" });
    setSortOrder(String(category.sortOrder));
    setImageUrl(category.imageUrl ?? "");
  }, [category]);

  const onUploadCover = useCallback(async (file: File) => {
    setUploadBusy(true);
    setError(null);
    try {
      const url = await uploadImageToR2(file, "machines");
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : m.common.uploadFailed);
    } finally {
      setUploadBusy(false);
    }
  }, [m.common.uploadFailed]);

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setBusy(true);
      setError(null);
      const sortParsed = Number.parseInt(sortOrder, 10);
      const sortOrderVal = Number.isFinite(sortParsed) ? Math.max(0, sortParsed) : 0;
      const translations = [
        { locale: AppLocale.ru, name: ru.name.trim(), slug: ru.slug.trim() },
        { locale: AppLocale.en, name: en.name.trim(), slug: en.slug.trim() },
      ];
      const imagePayload = imageUrl.trim().length > 0 ? imageUrl.trim() : null;

      if (category) {
        const res = await adminApiJson<MachineCategoryAdminRow>(
          `${ADMIN_API_MACHINE_CATEGORIES_PATH}/${category.id}`,
          {
            method: "PATCH",
            body: JSON.stringify({ sortOrder: sortOrderVal, imageUrl: imagePayload, translations }),
          },
        );
        if (!res.ok) {
          setError(formatAdminValidationError(res.error));
          setBusy(false);
          return;
        }
      } else {
        const res = await adminApiJson<MachineCategoryAdminRow>(ADMIN_API_MACHINE_CATEGORIES_PATH, {
          method: "POST",
          body: JSON.stringify({ sortOrder: sortOrderVal, imageUrl: imagePayload, translations }),
        });
        if (!res.ok) {
          setError(formatAdminValidationError(res.error));
          setBusy(false);
          return;
        }
      }
      setBusy(false);
      onSaved();
    },
    [category, en.name, en.slug, imageUrl, onSaved, ru.name, ru.slug, sortOrder],
  );

  return (
    <form className="space-y-6" onSubmit={(ev) => void onSubmit(ev)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className={formTitle}>{category ? m.machineCategoryForm.editTitle : m.machineCategoryForm.newTitle}</h3>
        <div className="flex flex-wrap gap-2">
          <button className={sec} onClick={onCancel} type="button">
            {m.machineCategoryForm.cancel}
          </button>
          <button className={pri} disabled={busy} type="submit">
            {busy ? m.machineCategoryForm.saving : m.machineCategoryForm.save}
          </button>
        </div>
      </div>

      {error ? (
        <p className={theme === "light" ? "text-sm text-red-600" : "text-sm text-red-400"}>{error}</p>
      ) : null}

      <div className="max-w-xs">
        <label className={labelCls} htmlFor="mc-sort">
          {m.machineCategoryForm.sortOrder}
        </label>
        <input
          className={inputCls}
          id="mc-sort"
          min={0}
          onChange={(e) => setSortOrder(e.target.value)}
          type="number"
          value={sortOrder}
        />
      </div>

      <div className="max-w-xl space-y-2">
        <div className={labelCls}>{m.machineCategoryForm.coverImage}</div>
        <p className={theme === "light" ? "text-xs text-neutral-500" : "text-xs text-neutral-400"}>
          {m.machineCategoryForm.coverHint}
        </p>
        <AdminOgImagePreview theme={theme} url={imageUrl} />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <label className={`${sec} cursor-pointer text-center`}>
            <input
              accept="image/*"
              className="sr-only"
              disabled={uploadBusy || busy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) {
                  void onUploadCover(f);
                }
              }}
              type="file"
            />
            {uploadBusy ? m.machineCategoryForm.uploading : m.machineCategoryForm.uploadCover}
          </label>
          {imageUrl.trim().length > 0 ? (
            <button
              className={sec}
              disabled={uploadBusy || busy}
              onClick={() => setImageUrl("")}
              type="button"
            >
              {m.machineCategoryForm.removeCover}
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{m.machineCategoryForm.localeRu}</p>
          <div>
            <label className={labelCls} htmlFor="mc-ru-name">
              {m.machineCategoryForm.name}
            </label>
            <input
              className={inputCls}
              id="mc-ru-name"
              onChange={(e) => setRu((p) => ({ ...p, name: e.target.value }))}
              type="text"
              value={ru.name}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="mc-ru-slug">
              {m.machineCategoryForm.slug}
            </label>
            <input
              className={inputCls}
              id="mc-ru-slug"
              onChange={(e) => setRu((p) => ({ ...p, slug: e.target.value }))}
              type="text"
              value={ru.slug}
            />
          </div>
        </div>
        <div className="space-y-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{m.machineCategoryForm.localeEn}</p>
          <div>
            <label className={labelCls} htmlFor="mc-en-name">
              {m.machineCategoryForm.name}
            </label>
            <input
              className={inputCls}
              id="mc-en-name"
              onChange={(e) => setEn((p) => ({ ...p, name: e.target.value }))}
              type="text"
              value={en.name}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="mc-en-slug">
              {m.machineCategoryForm.slug}
            </label>
            <input
              className={inputCls}
              id="mc-en-slug"
              onChange={(e) => setEn((p) => ({ ...p, slug: e.target.value }))}
              type="text"
              value={en.slug}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
