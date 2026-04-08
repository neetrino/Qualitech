"use client";

import type { MachineCategoryAdminRow } from "@/features/admin/admin-api-types.client";
import { categoryLabelForAdminSelect } from "@/features/admin/admin-machine-helpers.client";
import { useAdminMessages } from "@/features/admin/admin-messages.context";
import { useAdminTheme } from "@/features/admin/admin-theme.context";
import { adminBodyMutedClass, adminButtonPrimaryClass } from "@/features/admin/admin-ui.constants";

type AdminMachineCategoryListClientProps = {
  readonly categories: MachineCategoryAdminRow[];
  readonly loading: boolean;
  readonly onDelete: (id: string) => void;
  readonly onEdit: (id: string) => void;
  readonly onNew: () => void;
};

export function AdminMachineCategoryListClient({
  categories,
  loading,
  onDelete,
  onEdit,
  onNew,
}: AdminMachineCategoryListClientProps) {
  const m = useAdminMessages();
  const { theme } = useAdminTheme();
  const muted = adminBodyMutedClass(theme);
  const pri = adminButtonPrimaryClass();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{m.machineCategoryList.title}</h2>
        <button className={pri} onClick={onNew} type="button">
          {m.machineCategoryList.newSection}
        </button>
      </div>
      {loading ? <p className={muted}>{m.machineCategoryList.loading}</p> : null}
      {!loading && categories.length === 0 ? <p className={muted}>{m.machineCategoryList.empty}</p> : null}
      {!loading && categories.length > 0 ? (
        <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {categories.map((c) => {
            const ru = c.translations.find((t) => t.locale === "ru");
            const en = c.translations.find((t) => t.locale === "en");
            const cover = c.imageUrl?.trim();
            return (
              <li className="flex flex-wrap items-center justify-between gap-3 py-4" key={c.id}>
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  {cover && /^https?:\/\//i.test(cover) ? (
                    <div className="size-14 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-800">
                      {/* eslint-disable-next-line @next/next/no-img-element -- R2 / CDN URL */}
                      <img alt="" className="size-full object-cover" src={cover} />
                    </div>
                  ) : null}
                  <div className="min-w-0">
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">{categoryLabelForAdminSelect(c)}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {m.machineCategoryList.sortLabel}: {c.sortOrder}
                    {ru ? ` · RU: ${ru.slug}` : ""}
                    {en ? ` · EN: ${en.slug}` : ""}
                  </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-600"
                    onClick={() => onEdit(c.id)}
                    type="button"
                  >
                    {m.machineCategoryList.edit}
                  </button>
                  <button
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-700 dark:border-red-800 dark:text-red-400"
                    onClick={() => {
                      if (window.confirm(m.machineCategoryList.confirmDelete)) {
                        onDelete(c.id);
                      }
                    }}
                    type="button"
                  >
                    {m.machineCategoryList.delete}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
