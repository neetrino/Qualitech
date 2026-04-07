import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { homeLocaleToAppLocale } from "@/features/blog/blog.locale";
import { MachinesCategoryPage } from "@/features/machines/machines-category.page";
import { MACHINES_LIST_DEFAULT_LIMIT } from "@/features/machines/machines.constants";
import { loadMachinesMessages } from "@/features/machines/machines.messages";
import { machinesCategoryListHref } from "@/features/machines/machines-category-list-url";
import {
  getMachineCategorySectionPublic,
  listMachinesInCategorySectionPublic,
} from "@/features/machines/machines.service";
import type { HomeLocale } from "@/features/home/home.messages";
import { loadHomeMessages } from "@/features/home/home.messages";
import { isHomeLocaleSegment } from "@/lib/i18n/locale-routes";
import { SITE_TAB_TITLE } from "@/lib/site-metadata";

/** ISR seconds; keep in sync with `MACHINES_PUBLIC_REVALIDATE_SEC`. */
export const revalidate = 60;

type PageProps = {
  readonly params: Promise<{ locale: string; categorySlug: string }>;
  readonly searchParams: Promise<{ page?: string; featured?: string }>;
};

function parseListPage(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? "1", 10);
  if (!Number.isFinite(n) || n < 1) {
    return 1;
  }
  return n;
}

function parseFeaturedOnly(raw: string | undefined): boolean {
  return raw === "true" || raw === "1";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw, categorySlug } = await params;
  if (!isHomeLocaleSegment(raw)) {
    return { title: SITE_TAB_TITLE };
  }
  const appLocale = homeLocaleToAppLocale(raw);
  const section = await getMachineCategorySectionPublic(categorySlug, appLocale);
  const m = await loadMachinesMessages(raw);
  if (!section) {
    return { title: SITE_TAB_TITLE, description: m.metaDescription };
  }
  return {
    title: SITE_TAB_TITLE,
    description: m.metaDescription,
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale: raw, categorySlug } = await params;
  if (!isHomeLocaleSegment(raw)) {
    notFound();
  }
  const locale: HomeLocale = raw;
  const appLocale = homeLocaleToAppLocale(locale);
  const sp = await searchParams;
  const page = parseListPage(sp.page);
  const featuredOnly = parseFeaturedOnly(sp.featured);

  const section = await getMachineCategorySectionPublic(categorySlug, appLocale);
  if (!section) {
    notFound();
  }

  const result = await listMachinesInCategorySectionPublic(categorySlug, {
    locale: appLocale,
    page,
    limit: MACHINES_LIST_DEFAULT_LIMIT,
    ...(featuredOnly ? { featured: true } : {}),
  });
  if (!result) {
    notFound();
  }

  const totalPages = Math.max(1, Math.ceil(result.meta.total / result.meta.limit));
  if (result.meta.total === 0 && page > 1) {
    redirect(machinesCategoryListHref(locale, categorySlug, { page: 1, featuredOnly }));
  }
  if (result.meta.total > 0 && page > totalPages) {
    redirect(
      machinesCategoryListHref(locale, categorySlug, {
        page: totalPages,
        featuredOnly,
      }),
    );
  }

  const [homeMessages, machinesMessages] = await Promise.all([
    loadHomeMessages(locale),
    loadMachinesMessages(locale),
  ]);

  return (
    <MachinesCategoryPage
      featuredOnly={featuredOnly}
      homeMessages={homeMessages}
      locale={locale}
      machineSectionSlugByLocale={section.slugByLocale}
      machines={result.data}
      machinesMessages={machinesMessages}
      page={page}
      sectionName={section.name}
      sectionSlug={categorySlug}
      total={result.meta.total}
      totalPages={totalPages}
    />
  );
}
