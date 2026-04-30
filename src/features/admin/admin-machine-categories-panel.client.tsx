"use client";

import { useCallback, useEffect, useState } from "react";

import type { MachineCategoryAdminRow } from "@/features/admin/admin-api-types.client";
import { ADMIN_API_MACHINE_CATEGORIES_PATH } from "@/features/admin/admin.constants";
import { adminApiJson } from "@/features/admin/admin-http.client";
import { AdminMachineCategoryFormClient } from "@/features/admin/admin-machine-category-form.client";
import { AdminMachineCategoryListClient } from "@/features/admin/admin-machine-category-list.client";
import { useAdminMessages } from "@/features/admin/admin-messages.context";
import { useAdminTheme } from "@/features/admin/admin-theme.context";
import { adminBodyMutedClass, adminCardPanelClass } from "@/features/admin/admin-ui.constants";

type Mode = { kind: "list" } | { kind: "edit"; id: string | null };

export function AdminMachineCategoriesPanelClient() {
  const m = useAdminMessages();
  const { theme } = useAdminTheme();
  const card = adminCardPanelClass(theme);
  const muted = adminBodyMutedClass(theme);

  const [categories, setCategories] = useState<MachineCategoryAdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>({ kind: "list" });
  const [draft, setDraft] = useState<MachineCategoryAdminRow | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const loadList = useCallback(async () => {
    setLoading(true);
    const res = await adminApiJson<MachineCategoryAdminRow[]>(ADMIN_API_MACHINE_CATEGORIES_PATH, { method: "GET" });
    if (res.ok) {
      setCategories(res.data);
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
    const res = await adminApiJson<MachineCategoryAdminRow>(`${ADMIN_API_MACHINE_CATEGORIES_PATH}/${id}`, {
      method: "GET",
    });
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
      const res = await adminApiJson<{ ok: true }>(`${ADMIN_API_MACHINE_CATEGORIES_PATH}/${id}`, { method: "DELETE" });
      if (res.ok) {
        void loadList();
      } else {
        window.alert(res.error.message);
      }
    },
    [loadList],
  );

  const onToggleFeaturedOnHome = useCallback(
    async (id: string, nextFeatured: boolean) => {
      const res = await adminApiJson<MachineCategoryAdminRow>(`${ADMIN_API_MACHINE_CATEGORIES_PATH}/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ featured: nextFeatured }),
      });
      if (res.ok) {
        setCategories((prev) => prev.map((row) => (row.id === id ? res.data : row)));
      } else {
        window.alert(res.error.message);
      }
    },
    [],
  );

  if (mode.kind === "edit") {
    if (mode.id !== null && editLoading) {
      return (
        <div className={card}>
          <p className={muted}>{m.machineCategoryPanel.loading}</p>
        </div>
      );
    }
    return (
      <div className={card}>
        <AdminMachineCategoryFormClient category={draft} key={mode.id ?? "new"} onCancel={onCancel} onSaved={onSaved} />
      </div>
    );
  }

  return (
    <div className={card}>
      <AdminMachineCategoryListClient
        categories={categories}
        loading={loading}
        onDelete={onDelete}
        onEdit={openEdit}
        onNew={openNew}
        onToggleFeaturedOnHome={onToggleFeaturedOnHome}
      />
    </div>
  );
}
