import { cookies } from "next/headers";

import type { HomeLocale } from "@/features/home/home.messages";
import { HOME_LOCALE_COOKIE_NAME } from "@/lib/i18n/home-locale.constants";

/**
 * Resolves the active home locale from the `NEXT_LOCALE` cookie (`en` | `ru`), defaulting to `ru`.
 */
export async function getHomeLocale(): Promise<HomeLocale> {
  const jar = await cookies();
  const raw = jar.get(HOME_LOCALE_COOKIE_NAME)?.value;
  if (raw === "en" || raw === "ru") {
    return raw;
  }
  return "ru";
}
