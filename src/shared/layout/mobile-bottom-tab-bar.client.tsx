"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";
import {
  aboutPageHref,
  blogPageHref,
  contactPageHref,
  homePageHref,
  LOCALIZED_ABOUT_PATH,
  LOCALIZED_CONTACT_PATH,
  LOCALIZED_HOME_PATH,
  machinesPageHref,
} from "@/lib/i18n/locale-routes";

type TabId = "home" | "machines" | "about" | "blog";

function IconHome({ active }: { readonly active: boolean }) {
  const c = active ? "#ff6900" : "#a1a1aa";
  const w = active ? 2.2 : 1.8;
  return (
    <svg aria-hidden className="size-6" fill="none" viewBox="0 0 24 24" width={24} height={24}>
      <path d="M4 10.5 12 3l8 7.5V20a1 1 0 0 1-1 1h-4v-7H9v7H5a1 1 0 0 1-1-1v-9.5Z" stroke={c} strokeLinejoin="round" strokeWidth={w} />
    </svg>
  );
}

function IconMachines({ active }: { readonly active: boolean }) {
  const c = active ? "#ff6900" : "#a1a1aa";
  return (
    <svg aria-hidden className="size-6" fill="none" viewBox="0 0 24 24" width={24} height={24}>
      <circle cx="12" cy="12" r="3" stroke={c} strokeWidth={active ? 2.2 : 1.8} />
      <path
        d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke={c}
        strokeLinecap="round"
        strokeWidth={active ? 2.2 : 1.8}
      />
    </svg>
  );
}

function IconAbout({ active }: { readonly active: boolean }) {
  const c = active ? "#ff6900" : "#a1a1aa";
  return (
    <svg aria-hidden className="size-6" fill="none" viewBox="0 0 24 24" width={24} height={24}>
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth={active ? 2.2 : 1.8} />
      <path d="M12 16v-1m0-7h.01" stroke={c} strokeLinecap="round" strokeWidth={active ? 2.2 : 1.8} />
    </svg>
  );
}

function IconBlog({ active }: { readonly active: boolean }) {
  const c = active ? "#ff6900" : "#a1a1aa";
  return (
    <svg aria-hidden className="size-6" fill="none" viewBox="0 0 24 24" width={24} height={24}>
      <path
        d="M6 4h9a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke={c}
        strokeWidth={active ? 2.2 : 1.8}
      />
      <path d="M9 9h6M9 13h4" stroke={c} strokeLinecap="round" strokeWidth={active ? 2.2 : 1.8} />
    </svg>
  );
}

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

function tabActive(pathname: string, tab: TabId, locale: HomeLocale): boolean {
  if (tab === "home") {
    return LOCALIZED_HOME_PATH.test(pathname);
  }
  if (tab === "machines") {
    return pathname.startsWith(`/${locale}/machines`);
  }
  if (tab === "about") {
    return LOCALIZED_ABOUT_PATH.test(pathname);
  }
  if (tab === "blog") {
    return pathname.includes(`/${locale}/blog`);
  }
  return false;
}

function contactFabActive(pathname: string): boolean {
  return LOCALIZED_CONTACT_PATH.test(pathname);
}

function BottomTabLink({
  active,
  href,
  label,
  Icon,
}: {
  readonly active: boolean;
  readonly href: string;
  readonly label: string;
  readonly Icon: ComponentType<{ readonly active: boolean }>;
}) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={`flex min-h-[56px] flex-col items-center justify-end gap-1 rounded-xl px-0.5 pb-1.5 pt-0.5 transition-colors ${
        active ? "text-[#ff6900]" : "text-[#a1a1aa]"
      }`}
      href={href}
      prefetch
    >
      <Icon active={active} />
      <span className="max-w-[4.25rem] truncate text-center text-[9px] font-bold uppercase tracking-[0.06em]">
        {label}
      </span>
    </Link>
  );
}

export function MobileBottomTabBar({ locale, messages }: MobileBottomTabBarProps) {
  const pathname = usePathname() ?? "";
  const home = homePageHref(locale);
  const machines = machinesPageHref(locale);
  const about = aboutPageHref(locale);
  const blog = blogPageHref(locale);
  const contact = contactPageHref(locale);

  const tabs: { id: TabId; href: string; label: string; Icon: typeof IconHome }[] = [
    { id: "home", href: home, label: messages.nav.home, Icon: IconHome },
    { id: "machines", href: machines, label: messages.nav.machines, Icon: IconMachines },
    { id: "about", href: about, label: messages.nav.about, Icon: IconAbout },
    { id: "blog", href: blog, label: messages.nav.blog, Icon: IconBlog },
  ];

  const contactOn = contactFabActive(pathname);

  return (
    <nav
      aria-label={messages.header.menuTitle}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[98] md:hidden"
    >
      <div className="pointer-events-auto mx-auto max-w-lg px-3 pb-[max(0.35rem,env(safe-area-inset-bottom))]">
        <div className="relative rounded-t-[1.75rem] border border-white/25 border-b-0 bg-zinc-950/55 shadow-[0_-8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
          />
          <div className="grid grid-cols-5 items-end gap-0 px-1 pt-2">
            {tabs.slice(0, 2).map(({ id, href, label, Icon }) => (
              <BottomTabLink
                key={id}
                active={tabActive(pathname, id, locale)}
                href={href}
                Icon={Icon}
                label={label}
              />
            ))}
            <div className="relative flex min-h-[56px] flex-col items-center justify-end pb-1">
              <Link
                aria-current={contactOn ? "page" : undefined}
                className={`absolute -top-9 z-10 flex size-[3.75rem] items-center justify-center rounded-full bg-[#ff6900] text-black shadow-[0_10px_28px_rgba(255,105,0,0.5)] ring-[5px] ring-black/35 transition hover:brightness-110 active:brightness-95 ${
                  contactOn ? "ring-[#ff6900]/40" : ""
                }`}
                href={contact}
                prefetch
              >
                <IconPhone />
              </Link>
              <span
                className={`max-w-[4.25rem] truncate pt-6 text-center text-[9px] font-bold uppercase tracking-[0.06em] ${
                  contactOn ? "text-[#ff6900]" : "text-[#a1a1aa]"
                }`}
              >
                {messages.nav.contact}
              </span>
            </div>
            {tabs.slice(2, 4).map(({ id, href, label, Icon }) => (
              <BottomTabLink
                key={id}
                active={tabActive(pathname, id, locale)}
                href={href}
                Icon={Icon}
                label={label}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
