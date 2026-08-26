"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

import type { MachineCategoryAdminRow } from "@/features/admin/admin-api-types.client";
import { ADMIN_API_MACHINE_CATEGORIES_PATH } from "@/features/admin/admin.constants";
import { adminApiJson, formatAdminValidationError } from "@/features/admin/admin-http.client";
import {
  AdminMachineCategoryLocaleFields,
  buildCategoryTranslations,
  categoryTrFromApi,
  emptyCategoryTr,
  type CategoryTrForm,
} from "@/features/admin/admin-machine-category-locale-fields.client";
import { AdminOgImagePreview } from "@/features/admin/admin-og-image-preview.client";
import { useAdminMessages } from "@/features/admin/admin-messages.context";
import { useAdminTheme } from "@/features/admin/admin-theme.context";
import { uploadImageToR2 } from "@/features/admin/admin-upload.client";
import { normalizeMachineSlugForAdminStorage } from "@/lib/slug/normalize-machine-slug-for-admin";
import { slugifyForUrl } from "@/lib/slug/slugify-for-url";
import {
  adminButtonPrimaryClass,
  adminButtonSecondaryClass,
  adminFormSectionTitleClass,
  adminFormStickyBottomActionsClass,
  adminInputClass,
  adminLabelClass,
} from "@/features/admin/admin-ui.constants";

type AdminMachineCategoryFormClientProps = {
  readonly category: MachineCategoryAdminRow | null;
  readonly onCancel: () => void;
  readonly onSaved: () => void;
};

export function AdminMachineCategoryFormClient({ category, onCancel, onSaved }: AdminMachineCategoryFormClientProps) {
  const m = useAdminMessages();
  const { theme } = useAdminTheme();
  const pri = adminButtonPrimaryClass();
  const sec = adminButtonSecondaryClass(theme);
  const labelCls = adminLabelClass(theme);
  const inputCls = adminInputClass(theme);
  const formTitle = adminFormSectionTitleClass(theme);
  const stickyBottomActionsClass = adminFormStickyBottomActionsClass(theme);

  const [sortOrder, setSortOrder] = useState(String(category?.sortOrder ?? 0));
  const [imageUrl, setImageUrl] = useState(category?.imageUrl ?? "");
  const [categorySlug, setCategorySlug] = useState(() =>
    category?.slug ? normalizeMachineSlugForAdminStorage(category.slug) : "",
  );
  const [slugFollowsRuName, setSlugFollowsRuName] = useState(() => !category);
  const [ru, setRu] = useState<CategoryTrForm>(emptyCategoryTr);
  const [en, setEn] = useState<CategoryTrForm>(emptyCategoryTr);
  const [busy, setBusy] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) {
      setRu(emptyCategoryTr());
      setEn(emptyCategoryTr());
      setSortOrder("0");
      setImageUrl("");
      setCategorySlug("");
      setSlugFollowsRuName(true);
      return;
    }
    setRu(categoryTrFromApi(category.translations, "ru"));
    setEn(categoryTrFromApi(category.translations, "en"));
    setSortOrder(String(category.sortOrder));
    setImageUrl(category.imageUrl ?? "");
    setCategorySlug(normalizeMachineSlugForAdminStorage(category.slug));
    setSlugFollowsRuName(false);
  }, [category]);

  const onRuChange = useCallback(
    (next: CategoryTrForm) => {
      const prevDerived = slugifyForUrl(ru.name);
      const normalizedCurrent = normalizeMachineSlugForAdminStorage(categorySlug);
      const slugStillSynced =
        slugFollowsRuName &&
        (normalizedCurrent.length === 0 ||
          normalizedCurrent === normalizeMachineSlugForAdminStorage(slugifyForUrl(prevDerived)));
      if (slugStillSynced) {
        setCategorySlug(normalizeMachineSlugForAdminStorage(slugifyForUrl(next.name)));
      }
      setRu(next);
    },
    [categorySlug, ru.name, slugFollowsRuName],
  );

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
      let sortOrderVal: number;
      if (category) {
        sortOrderVal = category.sortOrder;
      } else {
        const sortParsed = Number.parseInt(sortOrder, 10);
        sortOrderVal = Number.isFinite(sortParsed) ? Math.max(0, sortParsed) : 0;
      }
      const imagePayload = imageUrl.trim().length > 0 ? imageUrl.trim() : null;
      const slugPayload = normalizeMachineSlugForAdminStorage(categorySlug);
      const translations = buildCategoryTranslations(ru, en, imagePayload);
      const body = JSON.stringify({
        slug: slugPayload,
        sortOrder: sortOrderVal,
        imageUrl: imagePayload,
        translations,
      });
      const path = category
        ? `${ADMIN_API_MACHINE_CATEGORIES_PATH}/${category.id}`
        : ADMIN_API_MACHINE_CATEGORIES_PATH;
      const res = await adminApiJson<MachineCategoryAdminRow>(path, {
        method: category ? "PATCH" : "POST",
        body,
      });
      if (!res.ok) {
        setError(formatAdminValidationError(res.error));
        setBusy(false);
        return;
      }
      setBusy(false);
      onSaved();
    },
    [category, categorySlug, en, imageUrl, onSaved, ru, sortOrder],
  );

  return (
    <form className="space-y-6" onSubmit={(ev) => void onSubmit(ev)}>
      <div>
        <h3 className={formTitle}>{category ? m.machineCategoryForm.editTitle : m.machineCategoryForm.newTitle}</h3>
      </div>

      {error ? (
        <p className={theme === "light" ? "text-sm text-red-600" : "text-sm text-red-400"}>{error}</p>
      ) : null}

      {!category ? (
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
      ) : null}

      <div>
        <label className={labelCls} htmlFor="mc-slug">
          {m.machineCategoryForm.slug}
        </label>
        <input
          className={inputCls}
          id="mc-slug"
          onChange={(e) => {
            setSlugFollowsRuName(false);
            setCategorySlug(normalizeMachineSlugForAdminStorage(e.target.value));
          }}
          type="text"
          value={categorySlug}
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
        <AdminMachineCategoryLocaleFields locale="ru" onChange={onRuChange} theme={theme} value={ru} />
        <AdminMachineCategoryLocaleFields locale="en" onChange={setEn} theme={theme} value={en} />
      </div>

      <div className={stickyBottomActionsClass}>
        <button className={sec} onClick={onCancel} type="button">
          {m.machineCategoryForm.cancel}
        </button>
        <button className={pri} disabled={busy || uploadBusy} type="submit">
          {busy ? m.machineCategoryForm.saving : m.machineCategoryForm.save}
        </button>
      </div>
    </form>
  );
}
