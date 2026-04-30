"use client";

import { useState } from "react";

import type { AdminTheme } from "@/features/admin/admin-theme.constants";
import type { MachineRow } from "@/features/admin/admin-api-types.client";
import { AdminOgImagePreview } from "@/features/admin/admin-og-image-preview.client";
import { useAdminMessages } from "@/features/admin/admin-messages.context";
import { useAdminTheme } from "@/features/admin/admin-theme.context";
import {
  adminBodyMutedClass,
  adminButtonDeleteExtraClass,
  adminButtonPrimaryClass,
  adminButtonSecondaryClass,
  adminListMetaClass,
  adminListTitleClass,
  adminPanelHeadingClass,
} from "@/features/admin/admin-ui.constants";

type AdminMachineListClientProps = {
  readonly machines: MachineRow[];
  readonly loading: boolean;
  readonly onNew: () => void;
  readonly onEdit: (id: string) => void;
  readonly onDelete: (id: string) => void;
  readonly onToggleFeatured: (id: string, nextFeatured: boolean) => Promise<void>;
  readonly onTogglePublished: (id: string, nextPublished: boolean) => Promise<void>;
};

function titlePreview(row: MachineRow): string {
  const ru = row.translations.find((t) => t.locale === "ru");
  const en = row.translations.find((t) => t.locale === "en");
  return (ru?.title ?? en?.title ?? row.id).slice(0, 80);
}

function slugPreview(row: MachineRow): string {
  const en = row.translations.find((t) => t.locale === "en");
  const ru = row.translations.find((t) => t.locale === "ru");
  const s = en?.slug ?? ru?.slug ?? "";
  return s.length > 0 ? s.slice(0, 80) : "—";
}

function categoryLabel(row: MachineRow): string {
  if (!row.category) {
    return "—";
  }
  const t =
    row.category.translations.find((x) => x.locale === "en") ?? row.category.translations[0];
  return t?.name ?? row.category.id;
}

/** First gallery image by sort order, else OG image from ru then en. */
function machineListThumbUrl(row: MachineRow): string {
  const sorted = [...row.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const first = sorted.find((i) => i.url.trim().length > 0);
  if (first) {
    return first.url.trim();
  }
  const ru = row.translations.find((t) => t.locale === "ru");
  const en = row.translations.find((t) => t.locale === "en");
  return (ru?.ogImageUrl ?? en?.ogImageUrl ?? "").trim();
}

function formatListDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return "—";
  }
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

function tableWrapClass(theme: AdminTheme): string {
  return theme === "light"
    ? "overflow-x-auto rounded-xl border border-zinc-200 bg-white"
    : "overflow-x-auto rounded-xl border border-white/10 bg-black/40";
}

function thClass(theme: AdminTheme): string {
  return theme === "light"
    ? "whitespace-nowrap border-b border-zinc-200 bg-zinc-100 px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-zinc-600"
    : "whitespace-nowrap border-b border-white/10 bg-white/[0.06] px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-[#9f9fa9]";
}

function tdClass(theme: AdminTheme): string {
  return theme === "light"
    ? "border-b border-zinc-100 px-3 py-2.5 align-middle text-sm text-zinc-800"
    : "border-b border-white/[0.08] px-3 py-2.5 align-middle text-sm text-white/90";
}

export function AdminMachineListClient({
  machines,
  loading,
  onNew,
  onEdit,
  onDelete,
  onToggleFeatured,
  onTogglePublished,
}: AdminMachineListClientProps) {
  const m = useAdminMessages();
  const { theme } = useAdminTheme();
  const [listPatchBusy, setListPatchBusy] = useState(false);
  const pri = adminButtonPrimaryClass();
  const sec = adminButtonSecondaryClass(theme);
  const del = `${sec} ${adminButtonDeleteExtraClass(theme)}`;
  const h2 = adminPanelHeadingClass(theme);
  const muted = adminBodyMutedClass(theme);
  const titleC = adminListTitleClass(theme);
  const metaC = adminListMetaClass(theme);
  const wrap = tableWrapClass(theme);
  const th = thClass(theme);
  const td = tdClass(theme);

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

  const onFeaturedStarClick = (id: string, current: boolean) =>
    runListPatch(() => onToggleFeatured(id, !current));

  const onPublishedClick = (id: string, current: boolean) =>
    runListPatch(() => onTogglePublished(id, !current));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
          <h2 className={h2}>{m.machineList.title}</h2>
          {!loading ? (
            <p className={muted}>
              {m.machineList.totalProducts}: {machines.length}
            </p>
          ) : null}
        </div>
        <button className={pri} onClick={onNew} type="button">
          {m.machineList.newProduct}
        </button>
      </div>

      {loading ? <p className={muted}>{m.machineList.loading}</p> : null}

      {!loading && machines.length === 0 ? <p className={muted}>{m.machineList.empty}</p> : null}

      {!loading && machines.length > 0 ? (
        <div className={wrap}>
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr>
                <th className={th}>{m.machineList.colProduct}</th>
                <th className={th}>{m.machineList.colStatus}</th>
                <th className={th}>{m.machineList.colCategory}</th>
                <th className={`${th} text-center`}>{m.machineList.colFeatured}</th>
                <th className={th}>{m.machineList.colCreated}</th>
                <th className={`${th} text-right`}>{m.machineList.colActions}</th>
              </tr>
            </thead>
            <tbody>
              {machines.map((rowItem) => (
                <tr key={rowItem.id}>
                  <td className={td}>
                    <div className="flex max-w-[min(100%,22rem)] items-start gap-3">
                      <AdminOgImagePreview
                        theme={theme}
                        url={machineListThumbUrl(rowItem)}
                        variant="thumb"
                      />
                      <div className="min-w-0">
                        <p className={titleC}>{titlePreview(rowItem)}</p>
                        <p className={`${metaC} font-mono text-[11px]`}>{slugPreview(rowItem)}</p>
                      </div>
                    </div>
                  </td>
                  <td className={td}>
                    <button
                      aria-label={
                        rowItem.published ? m.machineList.ariaMarkDraft : m.machineList.ariaMarkPublished
                      }
                      aria-pressed={rowItem.published}
                      className={
                        rowItem.published
                          ? "inline-flex cursor-pointer border-0 bg-transparent p-0 text-left font-medium text-[#ff6900] underline-offset-2 transition hover:underline disabled:cursor-wait disabled:no-underline disabled:opacity-50"
                          : theme === "light"
                            ? "inline-flex cursor-pointer border-0 bg-transparent p-0 text-left text-zinc-700 underline-offset-2 transition hover:underline disabled:cursor-wait disabled:no-underline disabled:opacity-50"
                            : "inline-flex cursor-pointer border-0 bg-transparent p-0 text-left text-white/80 underline-offset-2 transition hover:underline disabled:cursor-wait disabled:no-underline disabled:opacity-50"
                      }
                      disabled={listPatchBusy}
                      onClick={() => void onPublishedClick(rowItem.id, rowItem.published)}
                      type="button"
                    >
                      {rowItem.published ? m.machineList.published : m.machineList.draft}
                    </button>
                  </td>
                  <td className={`${td} max-w-[10rem] truncate`} title={categoryLabel(rowItem)}>
                    {categoryLabel(rowItem)}
                  </td>
                  <td className={`${td} text-center`}>
                    <button
                      aria-label={
                        rowItem.featured ? m.machineList.ariaRemoveFeatured : m.machineList.ariaAddFeatured
                      }
                      aria-pressed={rowItem.featured}
                      className={
                        rowItem.featured
                          ? "inline-flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-lg text-[#ff6900] transition hover:opacity-80 disabled:cursor-wait disabled:opacity-50"
                          : theme === "light"
                            ? "inline-flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-lg text-zinc-400 transition hover:text-zinc-600 disabled:cursor-wait disabled:opacity-50"
                            : "inline-flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-lg text-white/35 transition hover:text-white/55 disabled:cursor-wait disabled:opacity-50"
                      }
                      disabled={listPatchBusy}
                      onClick={() => void onFeaturedStarClick(rowItem.id, rowItem.featured)}
                      type="button"
                    >
                      {rowItem.featured ? "★" : "☆"}
                    </button>
                  </td>
                  <td className={`${td} tabular-nums`}>{formatListDate(rowItem.createdAt)}</td>
                  <td className={`${td} text-right`}>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      <button className={sec} onClick={() => onEdit(rowItem.id)} type="button">
                        {m.machineList.edit}
                      </button>
                      <button
                        className={del}
                        onClick={() => {
                          if (window.confirm(m.machineList.confirmDelete)) {
                            onDelete(rowItem.id);
                          }
                        }}
                        type="button"
                      >
                        {m.machineList.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
