"use client";

import type { MachineTranslationRow } from "@/features/admin/admin-api-types.client";
import { AdminMachineRichText } from "@/features/admin/admin-machine-rich-text.client";
import { useAdminMessages } from "@/features/admin/admin-messages.context";
import type { AdminTheme } from "@/features/admin/admin-theme.constants";
import {
  adminFieldsetShellClass,
  adminInputClass,
  adminLabelClass,
} from "@/features/admin/admin-ui.constants";

export const MACHINE_FORM_LOCALES = ["ru", "en"] as const;
export type MachineFormLocale = (typeof MACHINE_FORM_LOCALES)[number];

export type MachineTrForm = {
  title: string;
  description: string;
};

export function emptyMachineTr(): MachineTrForm {
  return {
    title: "",
    description: "",
  };
}

export function machineTrFromApi(t: MachineTranslationRow): MachineTrForm {
  return {
    title: t.title,
    description: t.description,
  };
}

export function buildMachineTranslations(
  map: Record<MachineFormLocale, MachineTrForm>,
  sharedOgImageUrl: string | null,
): MachineTranslationRow[] {
  const og =
    sharedOgImageUrl && sharedOgImageUrl.trim().length > 0 ? sharedOgImageUrl.trim() : null;
  return MACHINE_FORM_LOCALES.map((loc) => ({
    locale: loc,
    title: map[loc].title.trim(),
    description: map[loc].description.trim(),
    metaTitle: null,
    metaDescription: null,
    ogImageUrl: og,
  }));
}

type AdminMachineLocaleFieldsProps = {
  readonly theme: AdminTheme;
  readonly locale: MachineFormLocale;
  readonly value: MachineTrForm;
  readonly onChange: (next: MachineTrForm) => void;
};

export function AdminMachineLocaleFields({
  theme,
  locale,
  value,
  onChange,
}: AdminMachineLocaleFieldsProps) {
  const m = useAdminMessages();
  const label = locale.toUpperCase();
  const inC = adminInputClass(theme);
  const lab = adminLabelClass(theme);
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
      <AdminMachineRichText
        label={m.machineFields.description}
        onChange={(html) => onChange({ ...value, description: html })}
        placeholder={m.machineFields.descriptionPlaceholder}
        theme={theme}
        value={value.description}
      />
    </fieldset>
  );
}
