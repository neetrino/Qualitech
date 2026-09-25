"use client";

import { useCallback, useEffect, useState } from "react";

import type { ContactMessageRow } from "@/features/admin/admin-api-types.client";
import { adminApiJson } from "@/features/admin/admin-http.client";
import { useAdminMessages } from "@/features/admin/admin-messages.context";
import { useAdminTheme } from "@/features/admin/admin-theme.context";
import { ADMIN_API_MESSAGES_PATH } from "@/features/admin/admin.constants";
import {
  adminBodyMutedClass,
  adminButtonDeleteExtraClass,
  adminButtonSecondaryClass,
  adminCardPanelClass,
  adminListItemRowClass,
  adminListMetaClass,
  adminListTitleClass,
  adminPanelHeadingClass,
} from "@/features/admin/admin-ui.constants";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

type AdminMessageRowProps = {
  readonly row: ContactMessageRow;
  readonly marking: boolean;
  readonly deleting: boolean;
  readonly onMarkRead: (id: string) => void;
  readonly onDelete: (id: string) => void;
};

function AdminMessageDetails({ row }: { readonly row: ContactMessageRow }) {
  const m = useAdminMessages();
  const { theme } = useAdminTheme();
  const text = theme === "light" ? "text-zinc-700" : "text-white/80";

  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className={adminListTitleClass(theme)}>{row.name}</span>
        {!row.readAt ? (
          <span className="inline-flex items-center rounded-full bg-[#ff6900]/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#ff6900]">
            {m.messagesList.unread}
          </span>
        ) : null}
      </div>
      <div className={`mt-2 space-y-1 text-sm ${text}`}>
        <p className={adminListMetaClass(theme)}>
          <span className="font-semibold">{m.messagesList.fieldName}:</span> {row.name}
        </p>
        <p className={adminListMetaClass(theme)}>
          <span className="font-semibold">{m.messagesList.fieldEmail}:</span> {row.email}
        </p>
        <p className={adminListMetaClass(theme)}>
          <span className="font-semibold">{m.messagesList.fieldPhone}:</span> {row.phone}
        </p>
        <p className={adminListMetaClass(theme)}>
          <span className="font-semibold">{m.messagesList.fieldSentAt}:</span> {formatDate(row.createdAt)}
        </p>
        <p className={`pt-1 text-sm ${text} whitespace-pre-wrap`}>
          <span className="font-semibold">{m.messagesList.fieldMessage}:</span> {row.message}
        </p>
      </div>
    </div>
  );
}

function AdminMessageActions({ row, marking, deleting, onMarkRead, onDelete }: AdminMessageRowProps) {
  const m = useAdminMessages();
  const { theme } = useAdminTheme();
  const deleteClass = `${adminButtonSecondaryClass(theme)} ${adminButtonDeleteExtraClass(theme)}`;

  return (
    <div className="flex shrink-0 flex-col items-end gap-2">
      {!row.readAt ? (
        <button
          className={adminButtonSecondaryClass(theme)}
          disabled={marking}
          onClick={() => onMarkRead(row.id)}
          type="button"
        >
          {marking ? m.messagesList.marking : m.messagesList.markRead}
        </button>
      ) : (
        <p className={`text-xs ${theme === "light" ? "text-zinc-400" : "text-white/30"}`}>
          {m.messagesList.read} {formatDate(row.readAt)}
        </p>
      )}
      <button
        className={deleteClass}
        disabled={deleting}
        onClick={() => {
          if (window.confirm(m.messagesList.confirmDelete)) onDelete(row.id);
        }}
        type="button"
      >
        {deleting ? m.messagesList.deleting : m.messagesList.delete}
      </button>
    </div>
  );
}

function AdminMessageRow(props: AdminMessageRowProps) {
  const { theme } = useAdminTheme();
  return (
    <li className={adminListItemRowClass(theme)}>
      <AdminMessageDetails row={props.row} />
      <AdminMessageActions {...props} />
    </li>
  );
}

export function AdminMessagesPanelClient() {
  const m = useAdminMessages();
  const { theme } = useAdminTheme();

  const [rows, setRows] = useState<ContactMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminApiJson<ContactMessageRow[]>(ADMIN_API_MESSAGES_PATH, { method: "GET" });
    if (res.ok) setRows(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const markRead = useCallback(async (id: string) => {
    setMarkingId(id);
    const res = await adminApiJson<ContactMessageRow>(`${ADMIN_API_MESSAGES_PATH}/${id}`, {
      method: "PATCH",
    });
    if (res.ok) {
      setRows((prev) => prev.map((r) => (r.id === id ? res.data : r)));
    }
    setMarkingId(null);
  }, []);

  const remove = useCallback(async (id: string) => {
    setDeletingId(id);
    const res = await adminApiJson<{ ok: true }>(`${ADMIN_API_MESSAGES_PATH}/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setRows((prev) => prev.filter((row) => row.id !== id));
    }
    setDeletingId(null);
  }, []);

  const unreadCount = rows.filter((r) => !r.readAt).length;

  return (
    <div className={adminCardPanelClass(theme)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className={adminPanelHeadingClass(theme)}>
          {m.messagesList.title}
          {unreadCount > 0 ? (
            <span className="ml-2 inline-flex items-center rounded-full bg-[#ff6900] px-2 py-0.5 text-[10px] font-black text-black">
              {unreadCount}
            </span>
          ) : null}
        </h2>
        <button
          className={adminButtonSecondaryClass(theme)}
          disabled={loading}
          onClick={() => void load()}
          type="button"
        >
          {m.messagesList.refresh}
        </button>
      </div>

      {loading ? (
        <p className={adminBodyMutedClass(theme)}>{m.messagesList.loading}</p>
      ) : rows.length === 0 ? (
        <p className={adminBodyMutedClass(theme)}>{m.messagesList.empty}</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <AdminMessageRow
              deleting={deletingId === row.id}
              key={row.id}
              marking={markingId === row.id}
              onDelete={(id) => void remove(id)}
              onMarkRead={(id) => void markRead(id)}
              row={row}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
