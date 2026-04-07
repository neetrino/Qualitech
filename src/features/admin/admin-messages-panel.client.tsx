"use client";

import { useCallback, useEffect, useState } from "react";

import type { ContactMessageRow } from "@/features/admin/admin-api-types.client";
import { adminApiJson } from "@/features/admin/admin-http.client";
import { useAdminMessages } from "@/features/admin/admin-messages.context";
import { useAdminTheme } from "@/features/admin/admin-theme.context";
import { ADMIN_API_MESSAGES_PATH } from "@/features/admin/admin.constants";
import {
  adminBodyMutedClass,
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

export function AdminMessagesPanelClient() {
  const m = useAdminMessages();
  const { theme } = useAdminTheme();

  const [rows, setRows] = useState<ContactMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<string | null>(null);

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
            <li className={adminListItemRowClass(theme)} key={row.id}>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={adminListTitleClass(theme)}>{row.name}</span>
                  {!row.readAt ? (
                    <span className="inline-flex items-center rounded-full bg-[#ff6900]/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#ff6900]">
                      {m.messagesList.unread}
                    </span>
                  ) : null}
                </div>
                <p className={adminListMetaClass(theme)}>
                  {row.email} · {formatDate(row.createdAt)}
                </p>
                <p className={`mt-2 text-sm ${theme === "light" ? "text-zinc-700" : "text-white/80"} whitespace-pre-wrap`}>
                  {row.message}
                </p>
              </div>
              {!row.readAt ? (
                <button
                  className={`shrink-0 ${adminButtonSecondaryClass(theme)}`}
                  disabled={markingId === row.id}
                  onClick={() => void markRead(row.id)}
                  type="button"
                >
                  {markingId === row.id ? m.messagesList.marking : m.messagesList.markRead}
                </button>
              ) : (
                <p className={`shrink-0 text-xs ${theme === "light" ? "text-zinc-400" : "text-white/30"}`}>
                  {m.messagesList.read} {formatDate(row.readAt)}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
