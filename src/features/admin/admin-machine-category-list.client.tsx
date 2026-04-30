"use client";

import { useState } from "react";

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
  readonly onToggleFeaturedOnHome: (id: string, nextFeatured: boolean) => Promise<void>;
};

export function AdminMachineCategoryListClient({
  categories,
  loading,
  onDelete,
  onEdit,
  onNew,
  onToggleFeaturedOnHome,
}: AdminMachineCategoryListClientProps) {
  const m = useAdminMessages();
  const { theme } = useAdminTheme();
  const muted = adminBodyMutedClass(theme);
  const pri = adminButtonPrimaryClass();
  const [listPatchBusy, setListPatchBusy] = useState(false);

  const runListPatch = async (fn: () => Promise<void>) => {
    if (listPatchBusy) {
      return;
    }
    setListPatchBusy(true);
    try {
      await fn();
    } finally {
      setListPatchBusy(false);
    }
  };

  const onHomeStarClick = (id: string, current: boolean) =>
    runListPatch(() => onToggleFeaturedOnHome(id, !current));

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
            const homeFeatured = c.featured ?? true;
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
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <button
                    aria-label={
                      homeFeatured
                        ? m.machineCategoryList.ariaRemoveHomeFeatured
                        : m.machineCategoryList.ariaAddHomeFeatured
                    }
                    aria-pressed={homeFeatured}
                    className={
                      homeFeatured
                        ? "inline-flex size-10 cursor-pointer items-center justify-center rounded-lg border border-transparent text-xl text-[#ff6900] transition hover:opacity-80 disabled:cursor-wait disabled:opacity-50"
                        : theme === "light"
                          ? "inline-flex size-10 cursor-pointer items-center justify-center rounded-lg border border-neutral-300 text-xl text-neutral-400 transition hover:text-neutral-600 disabled:cursor-wait disabled:opacity-50 dark:border-neutral-600 dark:text-white/35 dark:hover:text-white/55"
                          : "inline-flex size-10 cursor-pointer items-center justify-center rounded-lg border border-neutral-600 text-xl text-white/35 transition hover:text-white/55 disabled:cursor-wait disabled:opacity-50"
                    }
                    disabled={listPatchBusy}
                    onClick={() => void onHomeStarClick(c.id, homeFeatured)}
                    type="button"
                  >
                    {homeFeatured ? "★" : "☆"}
                  </button>
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
