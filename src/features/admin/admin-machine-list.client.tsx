"use client";

import type { MachineRow } from "@/features/admin/admin-api-types.client";
import { useAdminMessages } from "@/features/admin/admin-messages.context";
import { useAdminTheme } from "@/features/admin/admin-theme.context";
import {
  adminBodyMutedClass,
  adminButtonDeleteExtraClass,
  adminButtonPrimaryClass,
  adminButtonSecondaryClass,
  adminFeaturedBadgeClass,
  adminListItemRowClass,
  adminListMetaClass,
  adminListMetaSeparatorClass,
  adminListTitleClass,
  adminPanelHeadingClass,
} from "@/features/admin/admin-ui.constants";

type AdminMachineListClientProps = {
  readonly machines: MachineRow[];
  readonly loading: boolean;
  readonly onNew: () => void;
  readonly onEdit: (id: string) => void;
  readonly onDelete: (id: string) => void;
};

function titlePreview(row: MachineRow): string {
  const ru = row.translations.find((t) => t.locale === "ru");
  const en = row.translations.find((t) => t.locale === "en");
  return (ru?.title ?? en?.title ?? row.id).slice(0, 80);
}

function categoryLabel(row: MachineRow): string {
  if (!row.category) {
    return "—";
  }
  const t =
    row.category.translations.find((x) => x.locale === "en") ?? row.category.translations[0];
  return t?.name ?? row.category.id;
}

export function AdminMachineListClient({
  machines,
  loading,
  onNew,
  onEdit,
  onDelete,
}: AdminMachineListClientProps) {
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
  const feat = adminFeaturedBadgeClass(theme);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className={h2}>{m.machineList.title}</h2>
        <button className={pri} onClick={onNew} type="button">
          {m.machineList.newProduct}
        </button>
      </div>

      {loading ? <p className={muted}>{m.machineList.loading}</p> : null}

      {!loading && machines.length === 0 ? <p className={muted}>{m.machineList.empty}</p> : null}

      <ul className="space-y-2">
        {machines.map((rowItem) => (
          <li className={row} key={rowItem.id}>
            <div className="min-w-0">
              <p className={titleC}>{titlePreview(rowItem)}</p>
              <p className={metaC}>
                <span className="text-[#ff6900]">
                  {rowItem.published ? m.machineList.published : m.machineList.draft}
                </span>
                {rowItem.featured ? (
                  <>
                    <span className={dot}>·</span>
                    <span className={feat}>{m.machineList.featured}</span>
                  </>
                ) : null}
                <span className={dot}>·</span>
                <span>{categoryLabel(rowItem)}</span>
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
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
          </li>
        ))}
      </ul>
    </div>
  );
}
