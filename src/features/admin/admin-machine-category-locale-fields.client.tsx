"use client";

import type { MachineCategoryAdminRow } from "@/features/admin/admin-api-types.client";
import { useAdminMessages } from "@/features/admin/admin-messages.context";
import type { AdminTheme } from "@/features/admin/admin-theme.constants";
import { adminHintTextClass, adminInputClass, adminLabelClass } from "@/features/admin/admin-ui.constants";

export type CategoryTrForm = {
  name: string;
  homeDescription: string;
  homeBulletsText: string;
  metaDescription: string;
};

export type CategoryFormLocale = "ru" | "en";

function toNullableMeta(s: string): string | null {
  const v = s.trim();
  return v.length > 0 ? v : null;
}

export function emptyCategoryTr(): CategoryTrForm {
  return { name: "", homeDescription: "", homeBulletsText: "", metaDescription: "" };
}

export function bulletsToTextarea(lines: readonly string[]): string {
  return lines.join("\n");
}

export function categoryTrFromApi(
  translations: MachineCategoryAdminRow["translations"],
  locale: CategoryFormLocale,
): CategoryTrForm {
  const t = translations.find((row) => row.locale === locale);
  return {
    name: t?.name ?? "",
    homeDescription: t?.homeDescription ?? "",
    homeBulletsText: bulletsToTextarea(t?.homeBullets ?? []),
    metaDescription: t?.metaDescription ?? "",
  };
}

function bulletsFromTextarea(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .slice(0, 12);
}

export function buildCategoryTranslations(
  ru: CategoryTrForm,
  en: CategoryTrForm,
  sharedOgImageUrl: string | null,
) {
  const og = sharedOgImageUrl && sharedOgImageUrl.trim().length > 0 ? sharedOgImageUrl.trim() : null;
  return [
    {
      locale: "ru" as const,
      name: ru.name.trim(),
      homeDescription: ru.homeDescription.trim(),
      homeBullets: bulletsFromTextarea(ru.homeBulletsText),
      metaDescription: toNullableMeta(ru.metaDescription),
      ogImageUrl: og,
    },
    {
      locale: "en" as const,
      name: en.name.trim(),
      homeDescription: en.homeDescription.trim(),
      homeBullets: bulletsFromTextarea(en.homeBulletsText),
      metaDescription: toNullableMeta(en.metaDescription),
      ogImageUrl: og,
    },
  ];
}

type LocaleFieldChrome = {
  readonly theme: AdminTheme;
  readonly prefix: string;
  readonly value: CategoryTrForm;
  readonly onChange: (next: CategoryTrForm) => void;
};

function CategoryLocaleCopyFields({ theme, prefix, value, onChange }: LocaleFieldChrome) {
  const m = useAdminMessages();
  const labelCls = adminLabelClass(theme);
  const inputCls = adminInputClass(theme);
  return (
    <>
      <div>
        <label className={labelCls} htmlFor={`${prefix}-name`}>
          {m.machineCategoryForm.name}
        </label>
        <input
          className={inputCls}
          id={`${prefix}-name`}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          type="text"
          value={value.name}
        />
      </div>
      <div>
        <label className={labelCls} htmlFor={`${prefix}-home-desc`}>
          {m.machineCategoryForm.homeDescription}
        </label>
        <textarea
          className={`${inputCls} min-h-[88px] resize-y`}
          id={`${prefix}-home-desc`}
          onChange={(e) => onChange({ ...value, homeDescription: e.target.value })}
          value={value.homeDescription}
        />
      </div>
      <div>
        <label className={labelCls} htmlFor={`${prefix}-home-bullets`}>
          {m.machineCategoryForm.homeBullets}
        </label>
        <textarea
          className={`${inputCls} min-h-[100px] resize-y font-mono text-sm`}
          id={`${prefix}-home-bullets`}
          onChange={(e) => onChange({ ...value, homeBulletsText: e.target.value })}
          placeholder={m.machineCategoryForm.homeBulletsPlaceholder}
          value={value.homeBulletsText}
        />
      </div>
    </>
  );
}

function CategoryLocaleSeoFields({ theme, prefix, value, onChange }: LocaleFieldChrome) {
  const m = useAdminMessages();
  const labelCls = adminLabelClass(theme);
  const inputCls = adminInputClass(theme);
  const hintCls = adminHintTextClass(theme);
  return (
    <div>
      <label className={labelCls} htmlFor={`${prefix}-meta-desc`}>
        {m.machineCategoryForm.metaDescription}
      </label>
      <p className={`mb-2 ${hintCls}`}>{m.machineCategoryForm.metaDescriptionHint}</p>
      <textarea
        className={`${inputCls} min-h-[88px] resize-y`}
        id={`${prefix}-meta-desc`}
        onChange={(e) => onChange({ ...value, metaDescription: e.target.value })}
        value={value.metaDescription}
      />
    </div>
  );
}

type AdminMachineCategoryLocaleFieldsProps = {
  readonly theme: AdminTheme;
  readonly locale: CategoryFormLocale;
  readonly value: CategoryTrForm;
  readonly onChange: (next: CategoryTrForm) => void;
};

export function AdminMachineCategoryLocaleFields({
  theme,
  locale,
  value,
  onChange,
}: AdminMachineCategoryLocaleFieldsProps) {
  const m = useAdminMessages();
  const prefix = `mc-${locale}`;
  const heading = locale === "ru" ? m.machineCategoryForm.localeRu : m.machineCategoryForm.localeEn;
  return (
    <div className="space-y-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{heading}</p>
      <CategoryLocaleCopyFields onChange={onChange} prefix={prefix} theme={theme} value={value} />
      <CategoryLocaleSeoFields onChange={onChange} prefix={prefix} theme={theme} value={value} />
    </div>
  );
}
