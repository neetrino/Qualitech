"use client";

import type { BlogTranslationRow } from "@/features/admin/admin-api-types.client";
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

export const BLOG_FORM_LOCALES = ["ru", "en"] as const;
export type BlogFormLocale = (typeof BLOG_FORM_LOCALES)[number];

export type BlogTrForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
};

export function emptyBlogTr(): BlogTrForm {
  return {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    ogImageUrl: "",
  };
}

export function blogTrFromApi(t: BlogTranslationRow): BlogTrForm {
  return {
    title: t.title,
    slug: t.slug,
    excerpt: t.excerpt,
    content: t.content,
    metaTitle: t.metaTitle ?? "",
    metaDescription: t.metaDescription ?? "",
    ogImageUrl: t.ogImageUrl ?? "",
  };
}

function toNullableMeta(s: string): string | null {
  const v = s.trim();
  return v.length > 0 ? v : null;
}

export function buildBlogTranslations(map: Record<BlogFormLocale, BlogTrForm>): BlogTranslationRow[] {
  return BLOG_FORM_LOCALES.map((loc) => ({
    locale: loc,
    title: map[loc].title.trim(),
    slug: map[loc].slug.trim(),
    excerpt: map[loc].excerpt.trim(),
    content: map[loc].content.trim(),
    metaTitle: toNullableMeta(map[loc].metaTitle),
    metaDescription: toNullableMeta(map[loc].metaDescription),
    ogImageUrl: toNullableMeta(map[loc].ogImageUrl),
  }));
}

type AdminBlogLocaleFieldsProps = {
  readonly theme: AdminTheme;
  readonly locale: BlogFormLocale;
  readonly value: BlogTrForm;
  readonly onChange: (next: BlogTrForm) => void;
  readonly onUploadOg: (file: File) => Promise<void>;
  readonly uploadBusy: boolean;
};

export function AdminBlogLocaleFields({
  theme,
  locale,
  value,
  onChange,
  onUploadOg,
  uploadBusy,
}: AdminBlogLocaleFieldsProps) {
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
        <label className={lab} htmlFor={`blog-${locale}-title`}>
          {m.blogFields.title}
        </label>
        <input
          className={inC}
          id={`blog-${locale}-title`}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          value={value.title}
        />
      </div>
      <div>
        <label className={lab} htmlFor={`blog-${locale}-slug`}>
          {m.blogFields.slug}
        </label>
        <input
          className={inC}
          id={`blog-${locale}-slug`}
          onChange={(e) => onChange({ ...value, slug: e.target.value })}
          value={value.slug}
        />
      </div>
      <div>
        <label className={lab} htmlFor={`blog-${locale}-excerpt`}>
          {m.blogFields.excerpt}
        </label>
        <textarea
          className={ta}
          id={`blog-${locale}-excerpt`}
          onChange={(e) => onChange({ ...value, excerpt: e.target.value })}
          rows={3}
          value={value.excerpt}
        />
      </div>
      <div>
        <label className={lab} htmlFor={`blog-${locale}-content`}>
          {m.blogFields.contentHtml}
        </label>
        <textarea
          className={ta}
          id={`blog-${locale}-content`}
          onChange={(e) => onChange({ ...value, content: e.target.value })}
          rows={8}
          value={value.content}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={lab} htmlFor={`blog-${locale}-metaTitle`}>
            {m.blogFields.metaTitle}
          </label>
          <input
            className={inC}
            id={`blog-${locale}-metaTitle`}
            onChange={(e) => onChange({ ...value, metaTitle: e.target.value })}
            value={value.metaTitle}
          />
        </div>
        <div>
          <label className={lab} htmlFor={`blog-${locale}-metaDesc`}>
            {m.blogFields.metaDescription}
          </label>
          <input
            className={inC}
            id={`blog-${locale}-metaDesc`}
            onChange={(e) => onChange({ ...value, metaDescription: e.target.value })}
            value={value.metaDescription}
          />
        </div>
      </div>
      <div>
        <div className={lab}>{m.blogFields.ogImage}</div>
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
            {m.blogFields.upload}
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
