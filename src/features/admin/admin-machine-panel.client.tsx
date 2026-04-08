"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { MachineCategoryAdminRow, MachineRow } from "@/features/admin/admin-api-types.client";
import { ADMIN_API_MACHINE_CATEGORIES_PATH, ADMIN_API_MACHINES_PATH } from "@/features/admin/admin.constants";
import { adminApiJson } from "@/features/admin/admin-http.client";
import { machineCategoryOptionsFromApi } from "@/features/admin/admin-machine-helpers.client";
import { AdminMachineFormClient } from "@/features/admin/admin-machine-form.client";
import { AdminMachineListClient } from "@/features/admin/admin-machine-list.client";
import { useAdminMessages } from "@/features/admin/admin-messages.context";
import { useAdminTheme } from "@/features/admin/admin-theme.context";
import { adminBodyMutedClass, adminCardPanelClass } from "@/features/admin/admin-ui.constants";

type Mode = { kind: "list" } | { kind: "edit"; id: string | null };

export function AdminMachinePanelClient() {
  const m = useAdminMessages();
  const { theme } = useAdminTheme();
  const card = adminCardPanelClass(theme);
  const muted = adminBodyMutedClass(theme);

  const [machines, setMachines] = useState<MachineRow[]>([]);
  const [categories, setCategories] = useState<MachineCategoryAdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>({ kind: "list" });
  const [draft, setDraft] = useState<MachineRow | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const categoryOptions = useMemo(() => machineCategoryOptionsFromApi(categories), [categories]);

  const loadCategories = useCallback(async () => {
    const res = await adminApiJson<MachineCategoryAdminRow[]>(ADMIN_API_MACHINE_CATEGORIES_PATH, { method: "GET" });
    if (res.ok) {
      setCategories(res.data);
    }
  }, []);

  const loadList = useCallback(async () => {
    setLoading(true);
    const res = await adminApiJson<MachineRow[]>(ADMIN_API_MACHINES_PATH, { method: "GET" });
    if (res.ok) {
      setMachines(res.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (mode.kind === "edit") {
      void loadCategories();
    }
  }, [mode.kind, loadCategories]);

  const openNew = useCallback(() => {
    setEditLoading(false);
    setDraft(null);
    setMode({ kind: "edit", id: null });
  }, []);

  const openEdit = useCallback(async (id: string) => {
    setEditLoading(true);
    setDraft(null);
    setMode({ kind: "edit", id });
    const res = await adminApiJson<MachineRow>(`${ADMIN_API_MACHINES_PATH}/${id}`, { method: "GET" });
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
      const res = await adminApiJson<{ ok: true }>(`${ADMIN_API_MACHINES_PATH}/${id}`, { method: "DELETE" });
      if (res.ok) {
        void loadList();
      }
    },
    [loadList],
  );

  const applyMachinePatch = useCallback(
    async (id: string, patch: { featured?: boolean; published?: boolean }) => {
      const res = await adminApiJson<MachineRow>(`${ADMIN_API_MACHINES_PATH}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        setMachines((prev) => prev.map((row) => (row.id === id ? res.data : row)));
      }
    },
    [],
  );

  const onToggleFeatured = useCallback(
    (id: string, nextFeatured: boolean) => applyMachinePatch(id, { featured: nextFeatured }),
    [applyMachinePatch],
  );

  const onTogglePublished = useCallback(
    (id: string, nextPublished: boolean) => applyMachinePatch(id, { published: nextPublished }),
    [applyMachinePatch],
  );

  if (mode.kind === "edit") {
    if (mode.id !== null && editLoading) {
      return (
        <div className={card}>
          <p className={muted}>{m.machinePanel.loadingProduct}</p>
        </div>
      );
    }
    return (
      <div className={card}>
        <AdminMachineFormClient
          categoryOptions={categoryOptions}
          key={mode.id ?? "new"}
          machine={draft}
          onCancel={onCancel}
          onSaved={onSaved}
        />
      </div>
    );
  }

  return (
    <div className={card}>
      <AdminMachineListClient
        loading={loading}
        machines={machines}
        onDelete={onDelete}
        onEdit={openEdit}
        onNew={openNew}
        onToggleFeatured={onToggleFeatured}
        onTogglePublished={onTogglePublished}
      />
    </div>
  );
}
