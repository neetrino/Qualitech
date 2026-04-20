import Image from "next/image";
import Link from "next/link";

import { homeAssets, navItemsMeta } from "@/features/home/home.data";
import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";
import { contactPageHref } from "@/lib/i18n/locale-routes";
import { LanguageSwitcher } from "@/shared/layout/language-switcher";
import { MobileHeader } from "@/shared/layout/mobile-header.client";
import {
  type HeaderNavContext,
  resolveLogoHref,
  resolveNavHref,
} from "@/shared/layout/header-nav-helpers";

export type HeaderProps = {
  readonly locale: HomeLocale;
  readonly messages: HomeMessages;
  readonly navContext?: HeaderNavContext;
  /** Blog index: keep `?page=` when switching locale (serializable — safe for Client Components). */
  readonly blogListPage?: number;
  /** Blog article: per-locale slugs for the same post (serializable). */
  readonly blogSlugByLocale?: Partial<Record<HomeLocale, string>>;
  /** Machines section listing: same category id, localized slugs. */
  readonly machineSectionSlugByLocale?: Partial<Record<HomeLocale, string>>;
  /** Machine product page: same machine id, localized slugs. */
  readonly machineSlugByLocale?: Partial<Record<HomeLocale, string>>;
};

export function Header({
  locale,
  messages,
  navContext = "home",
  blogListPage,
  blogSlugByLocale,
  machineSectionSlugByLocale,
  machineSlugByLocale,
}: HeaderProps) {
  const logoHref = resolveLogoHref(navContext, locale);
  const canPrefetchLogo = logoHref.startsWith("/");

  return (
    <>
      <MobileHeader
        blogListPage={blogListPage}
        blogSlugByLocale={blogSlugByLocale}
        locale={locale}
        machineSectionSlugByLocale={machineSectionSlugByLocale}
        machineSlugByLocale={machineSlugByLocale}
        messages={messages}
        navContext={navContext}
      />
      <header className="fixed inset-x-0 top-0 z-50 hidden w-full justify-center px-4 pt-3 sm:px-5 sm:pt-5 md:flex md:px-6 lg:px-8 lg:pt-6 xl:px-10">
      <div className="relative flex w-full max-w-[1200px] flex-col gap-3 rounded-[20px] bg-white p-3 text-black shadow-[0_16px_48px_rgba(0,0,0,0.28)] sm:rounded-3xl sm:p-4 lg:h-[64px] lg:flex-row lg:items-center lg:justify-between lg:rounded-[80px] lg:px-6 lg:py-0 xl:max-w-[1320px]">
        <div className="flex items-center justify-between gap-2 lg:contents">
          <Link className="shrink-0" href={logoHref} prefetch={canPrefetchLogo ? true : undefined}>
            <Image alt="Qualitech logo" className="h-auto w-[76px] sm:w-[88px] lg:w-[100px]" src={homeAssets.headerLogo} width={118} height={53} priority />
          </Link>
          <div className="flex shrink-0 items-center gap-2 sm:gap-[17px] lg:order-3">
            <Link
              className="flex h-9 min-w-0 flex-1 items-center justify-center rounded-full bg-[#ff6900] px-2 text-[9px] font-black uppercase tracking-[0.1em] text-black transition hover:brightness-110 sm:h-10 sm:max-w-[158px] sm:flex-none sm:px-3 sm:text-[11px] sm:tracking-[0.12em]"
              href={contactPageHref(locale)}
              prefetch
            >
              {messages.header.ctaRequest}
            </Link>
            <LanguageSwitcher
              blogListPage={blogListPage}
              blogSlugByLocale={blogSlugByLocale}
              locale={locale}
              machineSectionSlugByLocale={machineSectionSlugByLocale}
              machineSlugByLocale={machineSlugByLocale}
              messages={messages}
            />
          </div>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] tracking-[-0.02em] sm:gap-x-4 sm:text-xs lg:absolute lg:left-1/2 lg:top-1/2 lg:w-auto lg:-translate-x-1/2 lg:-translate-y-1/2 lg:justify-center lg:gap-5 lg:text-sm">
          {navItemsMeta.map((item) => {
            const navHref = resolveNavHref(item, navContext, locale);
            const canPrefetchNav = navHref.startsWith("/");

            return (
              <Link
                key={item.id}
                className="inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 transition hover:bg-black/5 hover:text-[#ff6900] sm:min-h-10 sm:px-3.5 lg:min-h-0 lg:px-4 lg:py-2"
                href={navHref}
                prefetch={canPrefetchNav ? true : undefined}
              >
                {messages.nav[item.id]}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
    </>
  );
}
