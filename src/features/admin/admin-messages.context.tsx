"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { AdminMessages } from "@/features/admin/admin.messages";

type AdminMessagesContextValue = {
  readonly messages: AdminMessages;
};

const AdminMessagesContext = createContext<AdminMessagesContextValue | null>(null);

export function AdminMessagesProvider({
  messages,
  children,
}: {
  readonly messages: AdminMessages;
  readonly children: ReactNode;
}) {
  return <AdminMessagesContext.Provider value={{ messages }}>{children}</AdminMessagesContext.Provider>;
}

/** Admin UI strings for the active site locale (from cookie via layout). */
export function useAdminMessages(): AdminMessages {
  const ctx = useContext(AdminMessagesContext);
  if (!ctx) {
    throw new Error("useAdminMessages must be used within AdminMessagesProvider");
  }
  return ctx.messages;
}
