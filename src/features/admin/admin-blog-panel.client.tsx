"use client";

import { useCallback, useEffect, useState } from "react";

import type { BlogRow } from "@/features/admin/admin-api-types.client";
import { ADMIN_API_BLOG_PATH } from "@/features/admin/admin.constants";
import { adminApiJson } from "@/features/admin/admin-http.client";
import { AdminBlogFormClient } from "@/features/admin/admin-blog-form.client";
import { AdminBlogListClient } from "@/features/admin/admin-blog-list.client";
import { useAdminMessages } from "@/features/admin/admin-messages.context";
import { useAdminTheme } from "@/features/admin/admin-theme.context";
import { adminBodyMutedClass, adminCardPanelClass } from "@/features/admin/admin-ui.constants";

type Mode = { kind: "list" } | { kind: "edit"; id: string | null };

export function AdminBlogPanelClient() {
  const m = useAdminMessages();
  const { theme } = useAdminTheme();
  const card = adminCardPanelClass(theme);
  const muted = adminBodyMutedClass(theme);

  const [posts, setPosts] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>({ kind: "list" });
  const [draft, setDraft] = useState<BlogRow | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const loadList = useCallback(async () => {
    setLoading(true);
    const res = await adminApiJson<BlogRow[]>(ADMIN_API_BLOG_PATH, { method: "GET" });
    if (res.ok) {
      setPosts(res.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  const openNew = useCallback(() => {
    setEditLoading(false);
    setDraft(null);
    setMode({ kind: "edit", id: null });
  }, []);

  const openEdit = useCallback(async (id: string) => {
    setEditLoading(true);
    setDraft(null);
    setMode({ kind: "edit", id });
    const res = await adminApiJson<BlogRow>(`${ADMIN_API_BLOG_PATH}/${id}`, { method: "GET" });
    if (res.ok) {
      setDraft(res.data);
    } else {
      setMode({ kind: "list" });
    }
    setEditLoading(false);
  }, []);

  const onCancel = useCallback(() => {
    setDraft(null);
    setMode({ kind: "list" });
  }, []);

  const onSaved = useCallback(() => {
    setDraft(null);
    setMode({ kind: "list" });
    void loadList();
  }, [loadList]);

  const onDelete = useCallback(
    async (id: string) => {
      const res = await adminApiJson<{ ok: true }>(`${ADMIN_API_BLOG_PATH}/${id}`, { method: "DELETE" });
      if (res.ok) {
        void loadList();
      }
    },
    [loadList],
  );

  if (mode.kind === "edit") {
    if (mode.id !== null && editLoading) {
      return (
        <div className={card}>
          <p className={muted}>{m.blogPanel.loadingArticle}</p>
        </div>
      );
    }
    return (
      <div className={card}>
        <AdminBlogFormClient key={mode.id ?? "new"} onCancel={onCancel} onSaved={onSaved} post={draft} />
      </div>
    );
  }

  return (
    <div className={card}>
      <AdminBlogListClient loading={loading} onDelete={onDelete} onEdit={openEdit} onNew={openNew} posts={posts} />
    </div>
  );
}
