"use client";

import { useCallback, useMemo, useState, type FormEvent } from "react";

import type { MachineImageRow, MachineRow } from "@/features/admin/admin-api-types.client";
import { ADMIN_API_MACHINES_PATH } from "@/features/admin/admin.constants";
import { adminApiJson, formatAdminValidationError } from "@/features/admin/admin-http.client";
import { AdminGalleryImageRows } from "@/features/admin/admin-gallery-image-rows.client";
import {
  AdminMachineLocaleFields,
  MACHINE_FORM_LOCALES,
  buildMachineTranslations,
  emptyMachineTr,
  machineTrFromApi,
  type MachineFormLocale,
  type MachineTrForm,
} from "@/features/admin/admin-machine-locale-fields.client";
import { useAdminMessages } from "@/features/admin/admin-messages.context";
import { useAdminTheme } from "@/features/admin/admin-theme.context";
import { uploadImageToR2 } from "@/features/admin/admin-upload.client";
import {
  adminButtonPrimaryClass,
  adminButtonSecondaryClass,
  adminCheckboxClass,
  adminCheckboxLabelClass,
  adminFormSectionTitleClass,
  adminHintTextClass,
  adminInputClass,
  adminLabelClass,
} from "@/features/admin/admin-ui.constants";

type CategoryOption = { id: string; label: string };

type AdminMachineFormClientProps = {
  readonly machine: MachineRow | null;
  readonly categoryOptions: CategoryOption[];
  readonly onCancel: () => void;
  readonly onSaved: () => void;
};

export function AdminMachineFormClient({
  machine,
  categoryOptions,
  onCancel,
  onSaved,
}: AdminMachineFormClientProps) {
  const m = useAdminMessages();
  const { theme } = useAdminTheme();
  const pri = adminButtonPrimaryClass();
  const sec = adminButtonSecondaryClass(theme);
  const labelCls = adminLabelClass(theme);
  const inputCls = adminInputClass(theme);
  const formTitle = adminFormSectionTitleClass(theme);

  const [categoryId, setCategoryId] = useState<string>(() => machine?.categoryId ?? "");
  const [featured, setFeatured] = useState(machine?.featured ?? false);
  const [published, setPublished] = useState(machine?.published ?? false);
  const [sortOrder, setSortOrder] = useState(String(machine?.sortOrder ?? 0));

  const initialMap = useMemo((): Record<MachineFormLocale, MachineTrForm> => {
    const base: Record<MachineFormLocale, MachineTrForm> = {
      ru: emptyMachineTr(),
      en: emptyMachineTr(),
    };
    if (!machine) {
      return base;
    }
    for (const t of machine.translations) {
      if (t.locale === "ru" || t.locale === "en") {
        base[t.locale] = machineTrFromApi(t);
      }
    }
    return base;
  }, [machine]);

  const [tr, setTr] = useState<Record<MachineFormLocale, MachineTrForm>>(initialMap);
  const [images, setImages] = useState<MachineImageRow[]>(() =>
    machine ? machine.images.map((i) => ({ ...i })) : [],
  );
  const [busy, setBusy] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setLocale = useCallback((loc: MachineFormLocale, next: MachineTrForm) => {
    setTr((prev) => ({ ...prev, [loc]: next }));
  }, []);

  const onUploadOg = useCallback(async (loc: MachineFormLocale, file: File) => {
    setUploadBusy(true);
    setError(null);
    try {
      const url = await uploadImageToR2(file, "machines");
      setTr((prev) => ({ ...prev, [loc]: { ...prev[loc], ogImageUrl: url } }));
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
      const translations = buildMachineTranslations(tr);
      const imagePayload = images
        .filter((i) => i.url.trim().length > 0)
        .map((i, idx) => ({
          url: i.url.trim(),
          alt: i.alt?.trim() ? i.alt.trim() : null,
          sortOrder: i.sortOrder ?? idx,
        }));

      const sortParsed = Number.parseInt(sortOrder, 10);
      const sortOrderVal = Number.isFinite(sortParsed) ? Math.max(0, sortParsed) : 0;
      const categoryPayload = categoryId.trim().length > 0 ? categoryId.trim() : null;

      if (machine) {
        const res = await adminApiJson<MachineRow>(`${ADMIN_API_MACHINES_PATH}/${machine.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            categoryId: categoryPayload,
            featured,
            published,
            sortOrder: sortOrderVal,
            translations,
            images: imagePayload,
          }),
        });
        if (!res.ok) {
          setError(formatAdminValidationError(res.error));
          setBusy(false);
          return;
        }
      } else {
        const res = await adminApiJson<MachineRow>(ADMIN_API_MACHINES_PATH, {
          method: "POST",
          body: JSON.stringify({
            categoryId: categoryPayload,
            featured,
            published,
            sortOrder: sortOrderVal,
            translations,
            images: imagePayload,
          }),
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
    [categoryId, featured, images, machine, onSaved, published, sortOrder, tr],
  );

  return (
    <form className="space-y-6" onSubmit={(ev) => void onSubmit(ev)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className={formTitle}>{machine ? m.machineForm.editTitle : m.machineForm.newTitle}</h3>
        <div className="flex flex-wrap gap-2">
          <button className={sec} onClick={onCancel} type="button">
            {m.machineForm.cancel}
          </button>
          <button className={pri} disabled={busy} type="submit">
            {busy ? m.machineForm.saving : m.machineForm.save}
          </button>
        </div>
      </div>

      {error ? (
        <p className={theme === "light" ? "text-sm text-red-600" : "text-sm text-red-400"}>{error}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className={labelCls} htmlFor="machine-category">
            {m.machineForm.category}
          </label>
          <select
            className={inputCls}
            id="machine-category"
            onChange={(e) => setCategoryId(e.target.value)}
            value={categoryId}
          >
            <option value="">{m.machineForm.noCategory}</option>
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          {categoryOptions.length === 0 ? (
            <p className={adminHintTextClass(theme)}>{m.machineForm.categoryHint}</p>
          ) : null}
        </div>
        <div>
          <label className={labelCls} htmlFor="machine-sort">
            {m.machineForm.sortOrder}
          </label>
          <input
            className={inputCls}
            id="machine-sort"
            min={0}
            onChange={(e) => setSortOrder(e.target.value)}
            type="number"
            value={sortOrder}
          />
        </div>
        <label className={`${adminCheckboxLabelClass(theme)} self-end`}>
          <input
            checked={featured}
            className={adminCheckboxClass(theme)}
            onChange={(e) => setFeatured(e.target.checked)}
            type="checkbox"
          />
          {m.machineForm.featured}
        </label>
        <label className={`${adminCheckboxLabelClass(theme)} self-end`}>
          <input
            checked={published}
            className={adminCheckboxClass(theme)}
            onChange={(e) => setPublished(e.target.checked)}
            type="checkbox"
          />
          {m.machineForm.published}
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {MACHINE_FORM_LOCALES.map((loc) => (
          <AdminMachineLocaleFields
            key={loc}
            locale={loc}
            onChange={(next) => setLocale(loc, next)}
            onUploadOg={(file) => onUploadOg(loc, file)}
            theme={theme}
            uploadBusy={uploadBusy}
            value={tr[loc]}
          />
        ))}
      </div>

      <AdminGalleryImageRows
        images={images}
        onImagesChange={setImages}
        reportError={(msg) => setError(msg)}
        theme={theme}
        uploadBusy={uploadBusy}
        uploadScope="machines"
        onUploadBusyChange={setUploadBusy}
      />
    </form>
  );
}
