"use client";

import type { BlogRow } from "@/features/admin/admin-api-types.client";
import { useAdminMessages } from "@/features/admin/admin-messages.context";
import { useAdminTheme } from "@/features/admin/admin-theme.context";
import {
  adminBodyMutedClass,
  adminButtonDeleteExtraClass,
  adminButtonPrimaryClass,
  adminButtonSecondaryClass,
  adminListItemRowClass,
  adminListMetaClass,
  adminListMetaSeparatorClass,
  adminListTitleClass,
  adminPanelHeadingClass,
} from "@/features/admin/admin-ui.constants";

type AdminBlogListClientProps = {
  readonly posts: BlogRow[];
  readonly loading: boolean;
  readonly onNew: () => void;
  readonly onEdit: (id: string) => void;
  readonly onDelete: (id: string) => void;
};

function titlePreview(post: BlogRow): string {
  const ru = post.translations.find((t) => t.locale === "ru");
  const en = post.translations.find((t) => t.locale === "en");
  return (ru?.title ?? en?.title ?? post.id).slice(0, 80);
}

function slugPreview(post: BlogRow): string {
  const ru = post.translations.find((t) => t.locale === "ru");
  const en = post.translations.find((t) => t.locale === "en");
  return ru?.slug ?? en?.slug ?? "—";
}

export function AdminBlogListClient({ posts, loading, onNew, onEdit, onDelete }: AdminBlogListClientProps) {
  const m = useAdminMessages();
  const { theme } = useAdminTheme();
  const pri = adminButtonPrimaryClass();
  const sec = adminButtonSecondaryClass(theme);
  const del = `${sec} ${adminButtonDeleteExtraClass(theme)}`;
  const row = adminListItemRowClass(theme);
  const h2 = adminPanelHeadingClass(theme);
  const muted = adminBodyMutedClass(theme);
  const titleC = adminListTitleClass(theme);
  const metaC = adminListMetaClass(theme);
  const dot = adminListMetaSeparatorClass(theme);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className={h2}>{m.blogList.title}</h2>
        <button className={pri} onClick={onNew} type="button">
          {m.blogList.newArticle}
        </button>
      </div>

      {loading ? <p className={muted}>{m.blogList.loading}</p> : null}

      {!loading && posts.length === 0 ? <p className={muted}>{m.blogList.empty}</p> : null}

      <ul className="space-y-2">
        {posts.map((post) => (
          <li className={row} key={post.id}>
            <div className="min-w-0">
              <p className={titleC}>{titlePreview(post)}</p>
              <p className={metaC}>
                <span className="text-[#ff6900]">{post.published ? m.blogList.published : m.blogList.draft}</span>
                <span className={dot}>·</span>
                <span className="font-mono">{slugPreview(post)}</span>
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button className={sec} onClick={() => onEdit(post.id)} type="button">
                {m.blogList.edit}
              </button>
              <button
                className={del}
                onClick={() => {
                  if (window.confirm(m.blogList.confirmDelete)) {
                    onDelete(post.id);
                  }
                }}
                type="button"
              >
                {m.blogList.delete}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
