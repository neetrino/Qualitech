import type { ReactNode } from "react";
import { cookies } from "next/headers";

import { AdminMessagesProvider } from "@/features/admin/admin-messages.context";
import { loadAdminMessages } from "@/features/admin/admin.messages";
import { HERO_CONTENT_TOP_PAD } from "@/features/home/home-hero-visual";
import type { HomeLocale } from "@/features/home/home.messages";
import { loadHomeMessages } from "@/features/home/home.messages";
import { HOME_LOCALE_COOKIE_NAME } from "@/lib/i18n/home-locale.constants";
import { Header } from "@/shared/layout/header";

function localeFromCookie(raw: string | undefined): HomeLocale {
  return raw === "en" || raw === "ru" ? raw : "ru";
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const jar = await cookies();
  const locale = localeFromCookie(jar.get(HOME_LOCALE_COOKIE_NAME)?.value);
  const homeMessages = await loadHomeMessages(locale);
  const adminMessages = await loadAdminMessages(locale);

  return (
    <>
      <Header locale={locale} messages={homeMessages} navContext="site" />
      <div className={HERO_CONTENT_TOP_PAD}>
        <AdminMessagesProvider messages={adminMessages}>{children}</AdminMessagesProvider>
      </div>
    </>
  );
}
