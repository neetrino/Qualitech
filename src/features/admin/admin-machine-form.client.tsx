"use client";

import { useCallback, useMemo, useState, type FormEvent } from "react";

import type { MachineImageRow, MachineRow } from "@/features/admin/admin-api-types.client";
import { ADMIN_API_MACHINES_PATH } from "@/features/admin/admin.constants";
import { adminApiJson, formatAdminValidationError } from "@/features/admin/admin-http.client";
import { AdminGalleryImageRows } from "@/features/admin/admin-gallery-image-rows.client";
import { AdminMachinePdfField } from "@/features/admin/admin-machine-pdf-field.client";
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
import {
  adminButtonPrimaryClass,
  adminButtonSecondaryClass,
  adminCheckboxClass,
  adminCheckboxLabelClass,
  adminFormSectionTitleClass,
  adminFormStickyBottomActionsClass,
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

function primaryImageUrlFromRows(images: MachineImageRow[]): string | null {
  const withUrl = images.filter((i) => i.url.trim().length > 0);
  if (withUrl.length === 0) {
    return null;
  }
  const primary = withUrl.find((i) => i.isPrimary) ?? withUrl[0];
  return primary?.url.trim() ?? null;
}

function mapApiImagesToForm(images: MachineImageRow[]): MachineImageRow[] {
  if (images.length === 0) {
    return [];
  }
  const hasPrimary = images.some((i) => i.isPrimary);
  if (hasPrimary) {
    return images.map((i) => ({ ...i }));
  }
  return images.map((i, idx) => ({ ...i, isPrimary: idx === 0 }));
}

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
  const stickyBottomActionsClass = adminFormStickyBottomActionsClass(theme);

  const [categoryId, setCategoryId] = useState<string>(() => machine?.categoryId ?? "");
  const [featured, setFeatured] = useState(machine?.featured ?? false);

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
    machine ? mapApiImagesToForm(machine.images.map((i) => ({ ...i }))) : [],
  );
  const [pdfUrl, setPdfUrl] = useState(() => machine?.pdfUrl?.trim() ?? "");
  const [busy, setBusy] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [pdfUploadBusy, setPdfUploadBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setLocale = useCallback((loc: MachineFormLocale, next: MachineTrForm) => {
    setTr((prev) => ({ ...prev, [loc]: next }));
  }, []);

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setBusy(true);
      setError(null);
      const ogUrl = primaryImageUrlFromRows(images);
      const translations = buildMachineTranslations(tr, ogUrl);
      const imagePayload = images
        .filter((i) => i.url.trim().length > 0)
        .map((i, idx) => ({
          url: i.url.trim(),
          alt: i.alt?.trim() ? i.alt.trim() : null,
          sortOrder: i.sortOrder ?? idx,
          isPrimary: i.isPrimary,
        }));

      const sortOrderVal = machine?.sortOrder ?? 0;
      const categoryPayload = categoryId.trim().length > 0 ? categoryId.trim() : null;
      const pdfPayload = pdfUrl.trim().length > 0 ? pdfUrl.trim() : null;

      if (machine) {
        const res = await adminApiJson<MachineRow>(`${ADMIN_API_MACHINES_PATH}/${machine.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            categoryId: categoryPayload,
            featured,
            published: machine.published,
            sortOrder: sortOrderVal,
            translations,
            images: imagePayload,
            pdfUrl: pdfPayload,
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
            sortOrder: sortOrderVal,
            translations,
            images: imagePayload,
            pdfUrl: pdfPayload,
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
    [categoryId, featured, images, machine, onSaved, pdfUrl, tr],
  );

  return (
    <form className="space-y-6" onSubmit={(ev) => void onSubmit(ev)}>
      <div>
        <h3 className={formTitle}>{machine ? m.machineForm.editTitle : m.machineForm.newTitle}</h3>
      </div>

      {error ? (
        <p className={theme === "light" ? "text-sm text-red-600" : "text-sm text-red-400"}>{error}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
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
        <label className={`${adminCheckboxLabelClass(theme)} self-end`}>
          <input
            checked={featured}
            className={adminCheckboxClass(theme)}
            onChange={(e) => setFeatured(e.target.checked)}
            type="checkbox"
          />
          {m.machineForm.featured}
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {MACHINE_FORM_LOCALES.map((loc) => (
          <AdminMachineLocaleFields
            key={loc}
            locale={loc}
            onChange={(next) => setLocale(loc, next)}
            theme={theme}
            value={tr[loc]}
          />
        ))}
      </div>

      <p className={adminHintTextClass(theme)}>{m.machineForm.galleryHint}</p>
      <AdminGalleryImageRows
        hideUrlAndAltFields
        images={images}
        onImagesChange={(next) =>
          setImages(
            next.map((row, idx) => ({
              url: row.url,
              alt: row.alt,
              sortOrder: row.sortOrder ?? idx,
              isPrimary: row.isPrimary ?? false,
            })),
          )
        }
        reportError={(msg) => setError(msg)}
        showPrimary
        theme={theme}
        uploadBusy={uploadBusy}
        uploadScope="machines"
        onUploadBusyChange={setUploadBusy}
      />

      <AdminMachinePdfField
        onPdfUrlChange={setPdfUrl}
        onUploadBusyChange={setPdfUploadBusy}
        pdfUrl={pdfUrl}
        reportError={(msg) => setError(msg)}
        theme={theme}
        uploadBusy={pdfUploadBusy}
      />

      <div className={stickyBottomActionsClass}>
        <button className={sec} onClick={onCancel} type="button">
          {m.machineForm.cancel}
        </button>
        <button className={pri} disabled={busy || uploadBusy || pdfUploadBusy} type="submit">
          {busy ? m.machineForm.saving : m.machineForm.save}
        </button>
      </div>
    </form>
  );
}
