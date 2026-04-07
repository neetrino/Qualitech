"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type RefObject } from "react";

import { homeAssets } from "@/features/home/home.data";
import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";
import { HOME_LOCALE_COOKIE_NAME } from "@/lib/i18n/home-locale.constants";
import {
  aboutPageHref,
  blogPageHref,
  blogPostPathForLocaleSwitch,
  contactPageHref,
  homePageHref,
  LOCALIZED_ABOUT_PATH,
  LOCALIZED_BLOG_LIST_PATH,
  LOCALIZED_BLOG_POST_PATH,
  LOCALIZED_CONTACT_PATH,
  LOCALIZED_HOME_PATH,
  LOCALIZED_MACHINES_DETAIL_PATH,
  LOCALIZED_MACHINES_INDEX_PATH,
  LOCALIZED_MACHINES_SECTION_PATH,
  machineDetailPathForLocaleSwitch,
  machinesPageHref,
  machinesSectionPathForLocaleSwitch,
} from "@/lib/i18n/locale-routes";

const LOCALE_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 365;
const LOCALE_ORDER: readonly HomeLocale[] = ["ru", "en"];

function writeHomeLocaleCookie(next: HomeLocale): void {
  document.cookie = `${HOME_LOCALE_COOKIE_NAME}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE_SEC}; SameSite=Lax`;
}

function useClosePopoverWhenOpen(
  open: boolean,
  rootRef: RefObject<HTMLDivElement | null>,
  onClose: () => void,
): void {
  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        onClose();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, rootRef]);
}

type LocaleMenuProps = {
  readonly listId: string;
  readonly ariaLabel: string;
  readonly locale: HomeLocale;
  readonly messages: HomeMessages;
  readonly onPick: (next: HomeLocale) => void;
};

function LocaleMenu({ listId, ariaLabel, locale, messages, onPick }: LocaleMenuProps) {
  return (
    <ul
      className="absolute right-0 top-[calc(100%+8px)] z-[60] min-w-[148px] overflow-hidden rounded-2xl border border-neutral-200 bg-white py-1.5 text-black shadow-[0_12px_40px_rgba(0,0,0,0.18)] sm:min-w-[160px]"
      id={listId}
      role="listbox"
      aria-label={ariaLabel}
    >
      {LOCALE_ORDER.map((code) => {
        const item = messages.header.locales[code];
        const selected = code === locale;
        return (
          <li key={code} role="presentation">
            <button
              className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-xs transition-colors sm:px-3.5 sm:text-sm ${selected ? "bg-neutral-100 font-semibold" : "hover:bg-neutral-50"}`}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onPick(code)}
            >
              <span className="font-black uppercase tracking-wide text-neutral-900">{item.short}</span>
              <span className="text-[11px] font-medium tracking-tight text-neutral-500 sm:text-xs">{item.name}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

type LanguageSwitcherProps = {
  readonly locale: HomeLocale;
  readonly messages: HomeMessages;
  readonly blogListPage?: number;
  readonly blogSlugByLocale?: Partial<Record<HomeLocale, string>>;
  readonly machineSectionSlugByLocale?: Partial<Record<HomeLocale, string>>;
  readonly machineSlugByLocale?: Partial<Record<HomeLocale, string>>;
};

export function LanguageSwitcher({
  locale,
  messages,
  blogListPage,
  blogSlugByLocale,
  machineSectionSlugByLocale,
  machineSlugByLocale,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const close = useCallback(() => setOpen(false), []);

  const applyLocale = useCallback(
    (next: HomeLocale) => {
      if (next === locale) {
        setOpen(false);
        return;
      }
      writeHomeLocaleCookie(next);
      setOpen(false);
      if (blogSlugByLocale && LOCALIZED_BLOG_POST_PATH.test(pathname)) {
        router.push(blogPostPathForLocaleSwitch(next, blogSlugByLocale));
        return;
      }
      if (LOCALIZED_BLOG_LIST_PATH.test(pathname)) {
        const p = blogListPage ?? 1;
        router.push(p > 1 ? `${blogPageHref(next)}?page=${p}` : blogPageHref(next));
        return;
      }
      if (
        machineSlugByLocale &&
        machineSectionSlugByLocale &&
        LOCALIZED_MACHINES_DETAIL_PATH.test(pathname)
      ) {
        router.push(machineDetailPathForLocaleSwitch(next, machineSectionSlugByLocale, machineSlugByLocale));
        return;
      }
      if (machineSectionSlugByLocale && LOCALIZED_MACHINES_SECTION_PATH.test(pathname)) {
        router.push(machinesSectionPathForLocaleSwitch(next, machineSectionSlugByLocale));
        return;
      }
      if (LOCALIZED_MACHINES_INDEX_PATH.test(pathname)) {
        router.push(machinesPageHref(next));
        return;
      }
      if (LOCALIZED_CONTACT_PATH.test(pathname)) {
        router.push(contactPageHref(next));
        return;
      }
      if (LOCALIZED_ABOUT_PATH.test(pathname)) {
        router.push(aboutPageHref(next));
        return;
      }
      if (LOCALIZED_HOME_PATH.test(pathname)) {
        router.push(homePageHref(next));
        return;
      }
      router.refresh();
    },
    [locale, pathname, router, blogListPage, blogSlugByLocale, machineSectionSlugByLocale, machineSlugByLocale],
  );

  useClosePopoverWhenOpen(open, rootRef, close);

  const current = messages.header.locales[locale];
  const chevronClass = open ? "rotate-[270deg]" : "rotate-90";

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <button
        aria-controls={listId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={messages.header.languageMenuAria}
        className="relative flex h-9 w-[88px] shrink-0 items-center rounded-3xl bg-black text-white transition-colors hover:bg-[#1a1a1a] sm:h-10 sm:w-[100px]"
        type="button"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="absolute left-1 top-1/2 size-7 -translate-y-1/2 sm:left-[6px] sm:size-8">
          <Image alt="" src={homeAssets.languageIcon} width={32} height={32} />
          <Image alt="" className="pointer-events-none absolute inset-0 m-auto" src={homeAssets.languageAccent} width={7} height={11} />
        </span>
        <span className="absolute left-10 top-1/2 -translate-y-1/2 text-xs font-semibold leading-[15.6px] sm:left-[46px] sm:text-sm">{current.short}</span>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 sm:right-3">
          <Image alt="" className={`transition-transform duration-200 ${chevronClass}`} src={homeAssets.languageArrow} width={1} height={15} />
        </span>
      </button>
      {open ? (
        <LocaleMenu
          ariaLabel={messages.header.languageMenuAria}
          listId={listId}
          locale={locale}
          messages={messages}
          onPick={applyLocale}
        />
      ) : null}
    </div>
  );
}
