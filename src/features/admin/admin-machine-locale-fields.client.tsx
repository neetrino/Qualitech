"use client";

import type { MachineTranslationRow } from "@/features/admin/admin-api-types.client";
import { useAdminMessages } from "@/features/admin/admin-messages.context";
import type { AdminTheme } from "@/features/admin/admin-theme.constants";
import { AdminOgImagePreview } from "@/features/admin/admin-og-image-preview.client";
import {
  adminButtonSecondaryClass,
  adminFieldsetShellClass,
  adminInputClass,
  adminLabelClass,
  adminTextareaClass,
} from "@/features/admin/admin-ui.constants";

export const MACHINE_FORM_LOCALES = ["ru", "en"] as const;
export type MachineFormLocale = (typeof MACHINE_FORM_LOCALES)[number];

export type MachineTrForm = {
  title: string;
  slug: string;
  shortDescription: string;
  body: string;
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
};

export function emptyMachineTr(): MachineTrForm {
  return {
    title: "",
    slug: "",
    shortDescription: "",
    body: "",
    metaTitle: "",
    metaDescription: "",
    ogImageUrl: "",
  };
}

export function machineTrFromApi(t: MachineTranslationRow): MachineTrForm {
  return {
    title: t.title,
    slug: t.slug,
    shortDescription: t.shortDescription,
    body: t.body,
    metaTitle: t.metaTitle ?? "",
    metaDescription: t.metaDescription ?? "",
    ogImageUrl: t.ogImageUrl ?? "",
  };
}

function toNullableMeta(s: string): string | null {
  const v = s.trim();
  return v.length > 0 ? v : null;
}

export function buildMachineTranslations(
  map: Record<MachineFormLocale, MachineTrForm>,
): MachineTranslationRow[] {
  return MACHINE_FORM_LOCALES.map((loc) => ({
    locale: loc,
    title: map[loc].title.trim(),
    slug: map[loc].slug.trim(),
    shortDescription: map[loc].shortDescription.trim(),
    body: map[loc].body.trim(),
    metaTitle: toNullableMeta(map[loc].metaTitle),
    metaDescription: toNullableMeta(map[loc].metaDescription),
    ogImageUrl: toNullableMeta(map[loc].ogImageUrl),
  }));
}

type AdminMachineLocaleFieldsProps = {
  readonly theme: AdminTheme;
  readonly locale: MachineFormLocale;
  readonly value: MachineTrForm;
  readonly onChange: (next: MachineTrForm) => void;
  readonly onUploadOg: (file: File) => Promise<void>;
  readonly uploadBusy: boolean;
};

export function AdminMachineLocaleFields({
  theme,
  locale,
  value,
  onChange,
  onUploadOg,
  uploadBusy,
}: AdminMachineLocaleFieldsProps) {
  const m = useAdminMessages();
  const label = locale.toUpperCase();
  const inC = adminInputClass(theme);
  const lab = adminLabelClass(theme);
  const ta = adminTextareaClass(theme);
  const sec = adminButtonSecondaryClass(theme);
  const leg =
    theme === "light"
      ? "px-1 text-xs font-black uppercase tracking-[0.12em] text-[#ea580c]"
      : "px-1 text-xs font-black uppercase tracking-[0.12em] text-[#ff6900]";

  return (
    <fieldset className={adminFieldsetShellClass(theme)}>
      <legend className={leg}>{label}</legend>
      <div>
        <label className={lab}>{m.machineFields.title}</label>
        <input
          className={inC}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          value={value.title}
        />
      </div>
      <div>
        <label className={lab}>{m.machineFields.slug}</label>
        <input
          className={inC}
          onChange={(e) => onChange({ ...value, slug: e.target.value })}
          value={value.slug}
        />
      </div>
      <div>
        <label className={lab}>{m.machineFields.shortDescription}</label>
        <textarea
          className={ta}
          onChange={(e) => onChange({ ...value, shortDescription: e.target.value })}
          rows={4}
          value={value.shortDescription}
        />
      </div>
      <div>
        <label className={lab}>{m.machineFields.bodyHtml}</label>
        <textarea
          className={ta}
          onChange={(e) => onChange({ ...value, body: e.target.value })}
          rows={8}
          value={value.body}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={lab}>{m.machineFields.metaTitle}</label>
          <input
            className={inC}
            onChange={(e) => onChange({ ...value, metaTitle: e.target.value })}
            value={value.metaTitle}
          />
        </div>
        <div>
          <label className={lab}>Meta description (SEO)</label>
          <input
            className={inC}
            onChange={(e) => onChange({ ...value, metaDescription: e.target.value })}
            value={value.metaDescription}
          />
        </div>
      </div>
      <div>
        <div className={lab}>{m.machineFields.ogImage}</div>
        <AdminOgImagePreview theme={theme} url={value.ogImageUrl} />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <label className={`${sec} cursor-pointer text-center`}>
            <input
              accept="image/*"
              className="sr-only"
              disabled={uploadBusy}
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) {
                  await onUploadOg(f);
                }
              }}
              type="file"
            />
            {m.machineFields.upload}
          </label>
          {value.ogImageUrl.trim().length > 0 ? (
            <button
              className={sec}
              disabled={uploadBusy}
              onClick={() => onChange({ ...value, ogImageUrl: "" })}
              type="button"
            >
              {m.gallery.remove}
            </button>
          ) : null}
        </div>
      </div>
    </fieldset>
  );
}
