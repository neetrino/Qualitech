import type { NavItemMeta } from "@/features/home/home.data";
import type { HomeLocale } from "@/features/home/home.messages";
import {
  aboutPageHref,
  blogPageHref,
  contactPageHref,
  homePageHref,
  machinesPageHref,
} from "@/lib/i18n/locale-routes";

export type HeaderNavContext = "home" | "site";

export function resolveNavHref(
  item: NavItemMeta,
  ctx: HeaderNavContext,
  locale: HomeLocale,
): string {
  if (item.id === "contact") {
    return contactPageHref(locale);
  }
  if (item.id === "blog") {
    return blogPageHref(locale);
  }
  if (item.id === "about") {
    return aboutPageHref(locale);
  }
  if (item.id === "machines") {
    return machinesPageHref(locale);
  }
  if (ctx === "home") {
    return item.href;
  }
  if (item.id === "home") {
    return homePageHref(locale);
  }
  return `${homePageHref(locale)}${item.href}`;
}

export function resolveLogoHref(ctx: HeaderNavContext, locale: HomeLocale): string {
  return ctx === "home" ? "#hero" : homePageHref(locale);
}
