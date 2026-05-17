import type { ReactNode } from "react";
import { cookies } from "next/headers";

import { AdminMessagesProvider } from "@/features/admin/admin-messages.context";
import { loadAdminMessages } from "@/features/admin/admin.messages";
import type { HomeLocale } from "@/features/home/home.messages";
import { HOME_LOCALE_COOKIE_NAME } from "@/lib/i18n/home-locale.constants";

function localeFromCookie(raw: string | undefined): HomeLocale {
  return raw === "en" || raw === "ru" ? raw : "ru";
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const jar = await cookies();
  const locale = localeFromCookie(jar.get(HOME_LOCALE_COOKIE_NAME)?.value);
  const adminMessages = await loadAdminMessages(locale);

  return (
    <AdminMessagesProvider locale={locale} messages={adminMessages}>
      {children}
    </AdminMessagesProvider>
  );
}
