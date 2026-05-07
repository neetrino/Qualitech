"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { AdminMessages } from "@/features/admin/admin.messages";
import type { HomeLocale } from "@/features/home/home.messages";

type AdminMessagesContextValue = {
  readonly messages: AdminMessages;
  readonly locale: HomeLocale;
};

const AdminMessagesContext = createContext<AdminMessagesContextValue | null>(null);

export function AdminMessagesProvider({
  messages,
  locale,
  children,
}: {
  readonly messages: AdminMessages;
  readonly locale: HomeLocale;
  readonly children: ReactNode;
}) {
  return <AdminMessagesContext.Provider value={{ locale, messages }}>{children}</AdminMessagesContext.Provider>;
}

/** Admin UI strings for the active site locale (from cookie via layout). */
export function useAdminMessages(): AdminMessages {
  const ctx = useContext(AdminMessagesContext);
  if (!ctx) {
    throw new Error("useAdminMessages must be used within AdminMessagesProvider");
  }
  return ctx.messages;
}

export function useAdminLocale(): HomeLocale {
  const ctx = useContext(AdminMessagesContext);
  if (!ctx) {
    throw new Error("useAdminLocale must be used within AdminMessagesProvider");
  }
  return ctx.locale;
}
