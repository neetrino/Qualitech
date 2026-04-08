import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { homeLocaleToAppLocale } from "@/features/blog/blog.locale";
import { MachinesIndexPage } from "@/features/machines/machines-index.page";
import { loadMachinesMessages } from "@/features/machines/machines.messages";
import { listTopLevelMachineCategoryCardsPublic } from "@/features/machines/machines.service";
import type { HomeLocale } from "@/features/home/home.messages";
import { loadHomeMessages } from "@/features/home/home.messages";
import { isHomeLocaleSegment } from "@/lib/i18n/locale-routes";
import { SITE_TAB_TITLE } from "@/lib/site-metadata";

/** ISR seconds; keep in sync with `MACHINES_PUBLIC_REVALIDATE_SEC` (Next requires a literal here). */
export const revalidate = 60;

export function generateStaticParams(): { locale: string }[] {
  return [{ locale: "en" }, { locale: "ru" }];
}

type PageProps = {
  readonly params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isHomeLocaleSegment(raw)) {
    return { title: SITE_TAB_TITLE };
  }
  const m = await loadMachinesMessages(raw);
  return {
    title: SITE_TAB_TITLE,
    description: m.metaDescription,
  };
}

export default async function Page({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isHomeLocaleSegment(raw)) {
    notFound();
  }
  const locale: HomeLocale = raw;
  const appLocale = homeLocaleToAppLocale(locale);
  const [homeMessages, machinesMessages, categories] = await Promise.all([
    loadHomeMessages(locale),
    loadMachinesMessages(locale),
    listTopLevelMachineCategoryCardsPublic(appLocale),
  ]);
  return (
    <MachinesIndexPage
      categories={categories}
      homeMessages={homeMessages}
      locale={locale}
      machinesMessages={machinesMessages}
    />
  );
}
