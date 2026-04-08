"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState, type ReactNode } from "react";

import { homeAssets, navItemsMeta } from "@/features/home/home.data";
import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";
import { contactPageHref } from "@/lib/i18n/locale-routes";
import { type HeaderNavContext, resolveLogoHref, resolveNavHref } from "@/shared/layout/header-nav-helpers";
import { LanguageSwitcher } from "@/shared/layout/language-switcher";

/** Below bottom tab bar (`z-98`); overlay above bar when menu open. */
const Z_MOBILE_HEADER = 99;
const Z_MOBILE_MENU_BACKDROP = 100;

type MobileHeaderProps = {
  readonly locale: HomeLocale;
  readonly messages: HomeMessages;
  readonly navContext?: HeaderNavContext;
  readonly blogListPage?: number;
  readonly blogSlugByLocale?: Partial<Record<HomeLocale, string>>;
  readonly machineSectionSlugByLocale?: Partial<Record<HomeLocale, string>>;
  readonly machineSlugByLocale?: Partial<Record<HomeLocale, string>>;
};

type MobileNavLink = {
  readonly id: (typeof navItemsMeta)[number]["id"];
  readonly href: string;
  readonly label: string;
};

function GlassBarSurface({ children }: { readonly children: ReactNode }) {
  return (
    <div className="relative flex h-14 items-center justify-between gap-2 rounded-[1.25rem] border border-white/20 bg-zinc-950/45 px-3 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl supports-[backdrop-filter]:bg-zinc-950/35">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[1.25rem] bg-gradient-to-b from-white/[0.08] to-transparent"
      />
      {children}
    </div>
  );
}

function HamburgerGlyph({ open }: { readonly open: boolean }) {
  const bar = "h-0.5 w-5 rounded-full bg-current transition-[transform,opacity] duration-200 ease-out";
  return (
    <span className="relative flex size-10 items-center justify-center" aria-hidden>
      <span
        className={`absolute ${bar} ${open ? "translate-y-0 rotate-45" : "-translate-y-1.5 rotate-0"}`}
      />
      <span className={`absolute ${bar} ${open ? "opacity-0" : "opacity-100"}`} />
      <span
        className={`absolute ${bar} ${open ? "translate-y-0 -rotate-45" : "translate-y-1.5 rotate-0"}`}
      />
    </span>
  );
}

type MobileGlassBarProps = {
  readonly canPrefetchLogo: boolean;
  readonly locale: HomeLocale;
  readonly logoHref: string;
  readonly machineSectionSlugByLocale?: Partial<Record<HomeLocale, string>>;
  readonly machineSlugByLocale?: Partial<Record<HomeLocale, string>>;
  readonly blogListPage?: number;
  readonly blogSlugByLocale?: Partial<Record<HomeLocale, string>>;
  readonly menuOpen: boolean;
  readonly messages: HomeMessages;
  readonly panelId: string;
  readonly onCloseMenu: () => void;
  readonly onToggleMenu: () => void;
};

function MobileGlassBar({
  blogListPage,
  blogSlugByLocale,
  canPrefetchLogo,
  locale,
  logoHref,
  machineSectionSlugByLocale,
  machineSlugByLocale,
  menuOpen,
  messages,
  panelId,
  onCloseMenu,
  onToggleMenu,
}: MobileGlassBarProps) {
  return (
    <header className="fixed inset-x-0 top-0 md:hidden" style={{ zIndex: Z_MOBILE_HEADER }}>
      <div className="px-3 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <GlassBarSurface>
          <Link
            className="relative z-[1] shrink-0"
            href={logoHref}
            onClick={onCloseMenu}
            prefetch={canPrefetchLogo ? true : undefined}
          >
            <Image
              alt="Qualitech logo"
              className="h-auto w-[68px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
              height={53}
              priority
              src={homeAssets.headerLogo}
              width={118}
            />
          </Link>
          <div className="relative z-[1] flex shrink-0 items-center gap-2">
            <div className="relative z-10 shrink-0">
              <LanguageSwitcher
                blogListPage={blogListPage}
                blogSlugByLocale={blogSlugByLocale}
                locale={locale}
                machineSectionSlugByLocale={machineSectionSlugByLocale}
                machineSlugByLocale={machineSlugByLocale}
                messages={messages}
              />
            </div>
            <button
              aria-controls={panelId}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? messages.header.closeMainMenu : messages.header.openMainMenu}
              className="relative flex size-10 shrink-0 items-center justify-center rounded-xl text-white transition hover:bg-white/10 active:bg-white/15"
              type="button"
              onClick={onToggleMenu}
            >
              <HamburgerGlyph open={menuOpen} />
            </button>
          </div>
        </GlassBarSurface>
      </div>
    </header>
  );
}

type MobileNavDrawerProps = {
  readonly contactHref: string;
  readonly messages: HomeMessages;
  readonly navLinks: readonly MobileNavLink[];
  readonly panelId: string;
  readonly onClose: () => void;
};

function GlassMenuOrnaments() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(120%_80%_at_50%_-20%,rgba(255,150,60,0.18),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-px rounded-[calc(1.75rem-1px)] ring-1 ring-inset ring-white/15"
      />
    </>
  );
}

type MobileNavDrawerLinksProps = {
  readonly navLinks: readonly MobileNavLink[];
  readonly onNavigate: () => void;
};

function MobileNavDrawerLinks({ navLinks, onNavigate }: MobileNavDrawerLinksProps) {
  return (
    <ul className="relative flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain px-2 py-2">
      {navLinks.map(({ id, href, label }) => {
        const canPrefetch = href.startsWith("/");
        return (
          <li key={id}>
            <Link
              className="flex min-h-[2.75rem] items-center rounded-xl px-3 text-sm font-semibold tracking-wide text-white/95 transition hover:bg-white/[0.12] hover:text-[#ff6900] active:bg-white/[0.18]"
              href={href}
              onClick={onNavigate}
              prefetch={canPrefetch ? true : undefined}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function MobileNavDrawer({ contactHref, messages, navLinks, panelId, onClose }: MobileNavDrawerProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4 py-[max(1rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] md:hidden"
      style={{ zIndex: Z_MOBILE_MENU_BACKDROP }}
    >
      <button
        aria-label={messages.header.closeMainMenu}
        className="absolute inset-0 z-0 bg-black/50 backdrop-blur-md transition-opacity"
        type="button"
        onClick={onClose}
      />
      <nav
        aria-label={messages.header.menuTitle}
        className="relative z-[1] flex max-h-[min(85dvh,calc(100svh-7rem))] w-full max-w-[min(20rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.75rem] border border-white/30 bg-gradient-to-br from-white/[0.14] via-zinc-950/50 to-zinc-950/75 shadow-[0_8px_0_0_rgba(255,255,255,0.06)_inset,0_32px_64px_-12px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl supports-[backdrop-filter]:from-white/[0.1] supports-[backdrop-filter]:via-zinc-950/40"
        id={panelId}
      >
        <GlassMenuOrnaments />
        <div className="relative flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2.5">
          <p className="pl-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">{messages.header.menuTitle}</p>
          <button
            aria-label={messages.header.closeMainMenu}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white transition hover:bg-white/15 active:bg-white/20"
            type="button"
            onClick={onClose}
          >
            <HamburgerGlyph open />
          </button>
        </div>
        <MobileNavDrawerLinks navLinks={navLinks} onNavigate={onClose} />
        <div className="relative border-t border-white/10 p-3 pt-3">
          <Link
            className="flex min-h-12 w-full items-center justify-center rounded-full bg-[#ff6900] px-4 text-center text-[11px] font-black uppercase tracking-[0.12em] text-black shadow-[0_10px_28px_rgba(255,105,0,0.4)] transition hover:brightness-110 active:brightness-95"
            href={contactHref}
            onClick={onClose}
            prefetch
          >
            {messages.header.ctaRequest}
          </Link>
        </div>
      </nav>
    </div>
  );
}

export function MobileHeader({
  locale,
  messages,
  navContext = "home",
  blogListPage,
  blogSlugByLocale,
  machineSectionSlugByLocale,
  machineSlugByLocale,
}: MobileHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const panelId = useId();
  const logoHref = resolveLogoHref(navContext, locale);
  const canPrefetchLogo = logoHref.startsWith("/");
  const contactHref = contactPageHref(locale);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const navLinks: MobileNavLink[] = navItemsMeta.map((item) => ({
    id: item.id,
    href: resolveNavHref(item, navContext, locale),
    label: messages.nav[item.id],
  }));

  return (
    <>
      <MobileGlassBar
        blogListPage={blogListPage}
        blogSlugByLocale={blogSlugByLocale}
        canPrefetchLogo={canPrefetchLogo}
        locale={locale}
        logoHref={logoHref}
        machineSectionSlugByLocale={machineSectionSlugByLocale}
        machineSlugByLocale={machineSlugByLocale}
        menuOpen={menuOpen}
        messages={messages}
        panelId={panelId}
        onCloseMenu={closeMenu}
        onToggleMenu={toggleMenu}
      />
      {menuOpen ? (
        <MobileNavDrawer
          contactHref={contactHref}
          messages={messages}
          navLinks={navLinks}
          panelId={panelId}
          onClose={closeMenu}
        />
      ) : null}
    </>
  );
}
