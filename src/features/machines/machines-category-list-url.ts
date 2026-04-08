import type { HomeLocale } from "@/features/home/home.messages";
import { machinesCategoryHref } from "@/lib/i18n/locale-routes";

/** Query string for `/[locale]/machines/[category]` list (page + optional featured). */
export function buildMachinesCategoryListQueryString(page: number, featuredOnly: boolean): string {
  const params = new URLSearchParams();
  if (featuredOnly) {
    params.set("featured", "true");
  }
  if (page > 1) {
    params.set("page", String(page));
  }
  const s = params.toString();
  return s.length > 0 ? `?${s}` : "";
}

export function machinesCategoryListHref(
  locale: HomeLocale,
  categorySlug: string,
  opts: { readonly page: number; readonly featuredOnly: boolean },
): string {
  return `${machinesCategoryHref(locale, categorySlug)}${buildMachinesCategoryListQueryString(
    opts.page,
    opts.featuredOnly,
  )}`;
}
