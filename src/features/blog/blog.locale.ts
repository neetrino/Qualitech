import { AppLocale } from "@prisma/client";

import type { HomeLocale } from "@/features/home/home.messages";

export function homeLocaleToAppLocale(locale: HomeLocale): AppLocale {
  return locale === "en" ? AppLocale.en : AppLocale.ru;
}
