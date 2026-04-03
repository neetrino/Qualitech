import Image from "next/image";
import Link from "next/link";

import { homeAssets, navItemsMeta } from "@/features/home/home.data";
import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";
import { LanguageSwitcher } from "@/shared/layout/language-switcher";

type HeaderProps = {
  readonly locale: HomeLocale;
  readonly messages: HomeMessages;
};

export function Header({ locale, messages }: HeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex w-full justify-center px-4 pt-3 sm:px-5 sm:pt-5 md:px-6 lg:px-8 lg:pt-6 xl:px-10">
      <div className="relative flex w-full max-w-[1120px] flex-col gap-3 rounded-[20px] bg-white p-3 text-black shadow-[0_16px_48px_rgba(0,0,0,0.28)] sm:rounded-3xl sm:p-4 lg:h-[64px] lg:flex-row lg:items-center lg:justify-between lg:rounded-[80px] lg:px-6 lg:py-0 xl:max-w-[1220px]">
        <div className="flex items-center justify-between gap-2 lg:contents">
          <Link className="shrink-0" href="#hero">
            <Image alt="Qualitech logo" className="h-auto w-[76px] sm:w-[88px] lg:w-[100px]" src={homeAssets.headerLogo} width={118} height={53} priority />
          </Link>
          <div className="flex shrink-0 items-center gap-2 sm:gap-[17px] lg:order-3">
            <button
              className="flex h-9 min-w-0 flex-1 items-center justify-center rounded-full bg-[#ff6900] px-2 text-[9px] font-black uppercase tracking-[0.1em] text-black transition hover:brightness-110 sm:h-10 sm:max-w-[158px] sm:flex-none sm:px-3 sm:text-[11px] sm:tracking-[0.12em]"
              type="button"
            >
              {messages.header.ctaRequest}
            </button>
            <LanguageSwitcher locale={locale} messages={messages} />
          </div>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px] tracking-[-0.02em] sm:gap-x-6 sm:text-xs lg:absolute lg:left-1/2 lg:top-1/2 lg:w-auto lg:-translate-x-1/2 lg:-translate-y-1/2 lg:justify-center lg:gap-10 lg:text-sm">
          {navItemsMeta.map((item) => (
            <Link key={item.id} className="whitespace-nowrap transition hover:text-[#ff6900]" href={item.href}>
              {messages.nav[item.id]}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
