"use client";

import { useCallback, useMemo, useState, type FormEvent } from "react";

import type { BlogImageRow, BlogRow } from "@/features/admin/admin-api-types.client";
import {
  AdminBlogLocaleFields,
  BLOG_FORM_LOCALES,
  blogTrFromApi,
  buildBlogTranslations,
  emptyBlogTr,
  type BlogFormLocale,
  type BlogTrForm,
} from "@/features/admin/admin-blog-locale-fields.client";
import { ADMIN_API_BLOG_PATH } from "@/features/admin/admin.constants";
import { adminApiJson, formatAdminValidationError } from "@/features/admin/admin-http.client";
import { AdminGalleryImageRows } from "@/features/admin/admin-gallery-image-rows.client";
import { useAdminMessages } from "@/features/admin/admin-messages.context";
import { useAdminTheme } from "@/features/admin/admin-theme.context";
import { uploadImageToR2 } from "@/features/admin/admin-upload.client";
import {
  adminButtonPrimaryClass,
  adminButtonSecondaryClass,
  adminCheckboxClass,
  adminCheckboxLabelClass,
  adminFormSectionTitleClass,
  adminInputClass,
  adminLabelClass,
} from "@/features/admin/admin-ui.constants";

type AdminBlogFormClientProps = {
  readonly post: BlogRow | null;
  readonly onCancel: () => void;
  readonly onSaved: () => void;
};

export function AdminBlogFormClient({ post, onCancel, onSaved }: AdminBlogFormClientProps) {
  const m = useAdminMessages();
  const { theme } = useAdminTheme();
  const [published, setPublished] = useState(post?.published ?? false);
  const [publishedAt, setPublishedAt] = useState(() => {
    if (!post?.publishedAt) {
      return "";
    }
    const d = new Date(post.publishedAt);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });

  const initialMap = useMemo((): Record<BlogFormLocale, BlogTrForm> => {
    const base: Record<BlogFormLocale, BlogTrForm> = {
      ru: emptyBlogTr(),
      en: emptyBlogTr(),
    };
    if (!post) {
      return base;
    }
    for (const t of post.translations) {
      if (t.locale === "ru" || t.locale === "en") {
        base[t.locale] = blogTrFromApi(t);
      }
    }
    return base;
  }, [post]);

  const [tr, setTr] = useState<Record<BlogFormLocale, BlogTrForm>>(initialMap);
  const [images, setImages] = useState<BlogImageRow[]>(() =>
    post ? post.images.map((i) => ({ ...i })) : [],
  );
  const [busy, setBusy] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setLocale = useCallback((loc: BlogFormLocale, next: BlogTrForm) => {
    setTr((prev) => ({ ...prev, [loc]: next }));
  }, []);

  const onUploadOg = useCallback(async (loc: BlogFormLocale, file: File) => {
    setUploadBusy(true);
    setError(null);
    try {
      const url = await uploadImageToR2(file, "blog");
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
      const translations = buildBlogTranslations(tr);
      const imagePayload = images
        .filter((i) => i.url.trim().length > 0)
        .map((i, idx) => ({
          url: i.url.trim(),
          alt: i.alt?.trim() ? i.alt.trim() : null,
          sortOrder: i.sortOrder ?? idx,
        }));

      if (post) {
        const publishedAtPayload =
          publishedAt.trim().length > 0 ? new Date(publishedAt).toISOString() : null;
        const res = await adminApiJson<BlogRow>(`${ADMIN_API_BLOG_PATH}/${post.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            published,
            publishedAt: publishedAtPayload,
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
        const publishedAtPayload =
          publishedAt.trim().length > 0 ? new Date(publishedAt).toISOString() : undefined;
        const res = await adminApiJson<BlogRow>(ADMIN_API_BLOG_PATH, {
          method: "POST",
          body: JSON.stringify({
            published,
            publishedAt: publishedAtPayload,
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
    [images, onSaved, post, published, publishedAt, tr],
  );

  const pri = adminButtonPrimaryClass();
  const sec = adminButtonSecondaryClass(theme);
  const title = adminFormSectionTitleClass(theme);

  return (
    <form className="space-y-6" onSubmit={(ev) => void onSubmit(ev)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className={title}>{post ? m.blogForm.editTitle : m.blogForm.newTitle}</h3>
        <div className="flex flex-wrap gap-2">
          <button className={sec} onClick={onCancel} type="button">
            {m.blogForm.cancel}
          </button>
          <button className={pri} disabled={busy} type="submit">
            {busy ? m.blogForm.saving : m.blogForm.save}
          </button>
        </div>
      </div>

      {error ? (
        <p className={theme === "light" ? "text-sm text-red-600" : "text-sm text-red-400"}>{error}</p>
      ) : null}

      <div className="flex flex-wrap gap-6">
        <label className={adminCheckboxLabelClass(theme)}>
          <input
            checked={published}
            className={adminCheckboxClass(theme)}
            onChange={(e) => setPublished(e.target.checked)}
            type="checkbox"
          />
          {m.blogForm.published}
        </label>
        <div>
          <label className={adminLabelClass(theme)} htmlFor="blog-published-at">
            {m.blogForm.publishedAt}
          </label>
          <input
            className={adminInputClass(theme)}
            id="blog-published-at"
            onChange={(e) => setPublishedAt(e.target.value)}
            type="datetime-local"
            value={publishedAt}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {BLOG_FORM_LOCALES.map((loc) => (
          <AdminBlogLocaleFields
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
        uploadScope="blog"
        onUploadBusyChange={setUploadBusy}
      />
    </form>
  );
}
