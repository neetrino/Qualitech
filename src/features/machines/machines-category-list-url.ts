import type { HomeLocale } from "@/features/home/home.messages";
import { machinesCategoryHref } from "@/lib/i18n/locale-routes";

/** Query string for `/[locale]/machines/[category]` list pagination. */
export function buildMachinesCategoryListQueryString(page: number): string {
  const params = new URLSearchParams();
  if (page > 1) {
    params.set("page", String(page));
  }
  const s = params.toString();
  return s.length > 0 ? `?${s}` : "";
}

export function machinesCategoryListHref(
  locale: HomeLocale,
  categorySlug: string,
  opts: { readonly page: number },
): string {
  return `${machinesCategoryHref(locale, categorySlug)}${buildMachinesCategoryListQueryString(opts.page)}`;
}
