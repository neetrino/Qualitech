"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";

import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";

const MOBILE_CALL_PHONE = "093219830";

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

function buildTelHref(display: string): string {
  return `tel:${display.replace(/[^\d+]/g, "")}`;
}

function resolveMobileCallHref(messages: HomeMessages): string {
  const phoneDisplay = messages.footer.contact.phones[1] ?? MOBILE_CALL_PHONE;
  return buildTelHref(phoneDisplay);
}

function openPhoneDialer(phoneHref: string): void {
  window.location.assign(phoneHref);
}

function handleCallClick(event: MouseEvent<HTMLAnchorElement>, phoneHref: string): void {
  event.preventDefault();
  openPhoneDialer(phoneHref);
}

export function MobileBottomTabBar({ locale: _locale, messages }: MobileBottomTabBarProps) {
  const [mounted, setMounted] = useState(false);
  const phoneHref = resolveMobileCallHref(messages);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <a
      aria-label={messages.nav.contact}
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-[120] flex size-[3.6rem] touch-manipulation items-center justify-center rounded-full bg-[#ff6900] text-black shadow-[0_10px_28px_rgba(255,105,0,0.5)] ring-[4px] ring-black/35 transition hover:brightness-110 active:brightness-95 md:hidden"
      href={phoneHref}
      onClick={(event) => handleCallClick(event, phoneHref)}
    >
      <IconPhone />
    </a>,
    document.body,
  );
}
