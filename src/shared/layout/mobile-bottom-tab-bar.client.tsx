"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";
import { contactPageHref, LOCALIZED_CONTACT_PATH } from "@/lib/i18n/locale-routes";

function IconPhone() {
  return (
    <svg aria-hidden className="size-7 text-black" fill="currentColor" viewBox="0 0 24 24" width={28} height={28}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.35 1.72.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c1.09.35 1.95.58 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

type MobileBottomTabBarProps = {
  readonly locale: HomeLocale;
  readonly messages: HomeMessages;
};

function contactFabActive(pathname: string): boolean {
  return LOCALIZED_CONTACT_PATH.test(pathname);
}

export function MobileBottomTabBar({ locale, messages }: MobileBottomTabBarProps) {
  const pathname = usePathname() ?? "";
  const contact = contactPageHref(locale);
  const contactOn = contactFabActive(pathname);

  return (
    <div className="pointer-events-none fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-[98] md:hidden">
      <Link
        aria-current={contactOn ? "page" : undefined}
        aria-label={messages.nav.contact}
        className={`pointer-events-auto flex size-[3.6rem] items-center justify-center rounded-full bg-[#ff6900] text-black shadow-[0_10px_28px_rgba(255,105,0,0.5)] ring-[4px] ring-black/35 transition hover:brightness-110 active:brightness-95 ${
          contactOn ? "ring-[#ff6900]/40" : ""
        }`}
        href={contact}
        prefetch
      >
        <IconPhone />
      </Link>
    </div>
  );
}
