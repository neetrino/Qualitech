import type { HomeLocale } from "@/features/home/home.messages";

const INTL_LOCALE_BY_HOME: Record<HomeLocale, string> = {
  en: "en-US",
  ru: "ru-RU",
};

export function formatBlogPublishedDate(iso: string | null, homeLocale: HomeLocale): string {
  if (iso === null) {
    return "";
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat(INTL_LOCALE_BY_HOME[homeLocale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}
