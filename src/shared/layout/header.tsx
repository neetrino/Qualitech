import Image from "next/image";
import Link from "next/link";

import { homeAssets, navItems } from "@/features/home/home.data";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex justify-center px-4 pt-3 sm:px-5 sm:pt-5 md:px-6 lg:px-8 lg:pt-6 xl:px-10">
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
              ОСТАВИТЬ ЗАЯВКУ
            </button>
            <button className="relative flex h-9 w-[88px] shrink-0 items-center rounded-3xl bg-black text-white sm:h-10 sm:w-[100px]" type="button">
              <span className="absolute left-1 top-1/2 size-7 -translate-y-1/2 sm:left-[6px] sm:size-8">
                <Image alt="" src={homeAssets.languageIcon} width={32} height={32} />
                <Image alt="" className="pointer-events-none absolute inset-0 m-auto" src={homeAssets.languageAccent} width={7} height={11} />
              </span>
              <span className="absolute left-10 top-1/2 -translate-y-1/2 text-xs font-semibold leading-[15.6px] sm:left-[46px] sm:text-sm">РУС</span>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 sm:right-3">
                <Image alt="" className="rotate-90" src={homeAssets.languageArrow} width={1} height={15} />
              </span>
            </button>
          </div>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px] tracking-[-0.02em] sm:gap-x-6 sm:text-xs lg:absolute lg:left-1/2 lg:top-1/2 lg:w-auto lg:-translate-x-1/2 lg:-translate-y-1/2 lg:justify-center lg:gap-10 lg:text-sm">
          {navItems.map((item) => (
            <Link key={item.label} className="whitespace-nowrap transition hover:text-[#ff6900]" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
