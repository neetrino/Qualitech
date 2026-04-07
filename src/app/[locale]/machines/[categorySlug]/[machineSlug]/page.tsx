import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { homeLocaleToAppLocale } from "@/features/blog/blog.locale";
import { MachineDetailPage } from "@/features/machines/machine-detail.page";
import { loadMachinesMessages } from "@/features/machines/machines.messages";
import {
  getMachineDetailForSectionPublic,
  listRelatedMachinesInSectionPublic,
} from "@/features/machines/machines.service";
import type { HomeLocale } from "@/features/home/home.messages";
import { loadHomeMessages } from "@/features/home/home.messages";
import { isHomeLocaleSegment } from "@/lib/i18n/locale-routes";
import { htmlToPlainText } from "@/lib/html/html-to-plain-excerpt";
import { SITE_TAB_TITLE } from "@/lib/site-metadata";

/** ISR seconds; keep in sync with `MACHINES_PUBLIC_REVALIDATE_SEC`. */
export const revalidate = 60;

type PageProps = {
  readonly params: Promise<{ locale: string; categorySlug: string; machineSlug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw, categorySlug, machineSlug } = await params;
  if (!isHomeLocaleSegment(raw)) {
    return { title: SITE_TAB_TITLE };
  }
  const appLocale = homeLocaleToAppLocale(raw);
  const payload = await getMachineDetailForSectionPublic(machineSlug, categorySlug, appLocale);
  const m = await loadMachinesMessages(raw);
  if (!payload) {
    return { title: SITE_TAB_TITLE, description: m.metaDescription };
  }
  const { detail } = payload;
  return {
    title: SITE_TAB_TITLE,
    description: detail.metaDescription ?? htmlToPlainText(detail.description),
    openGraph: detail.ogImageUrl
      ? { images: [{ url: detail.ogImageUrl, alt: detail.title }] }
      : undefined,
  };
}

export default async function Page({ params }: PageProps) {
  const { locale: raw, categorySlug, machineSlug } = await params;
  if (!isHomeLocaleSegment(raw)) {
    notFound();
  }
  const locale: HomeLocale = raw;
  const appLocale = homeLocaleToAppLocale(locale);
  const payload = await getMachineDetailForSectionPublic(machineSlug, categorySlug, appLocale);
  if (!payload) {
    notFound();
  }
  const [homeMessages, machinesMessages, relatedProducts] = await Promise.all([
    loadHomeMessages(locale),
    loadMachinesMessages(locale),
    listRelatedMachinesInSectionPublic(categorySlug, payload.detail.id, appLocale),
  ]);
  return (
    <MachineDetailPage
      homeMessages={homeMessages}
      locale={locale}
      machinesMessages={machinesMessages}
      payload={payload}
      relatedProducts={relatedProducts}
      sectionSlug={categorySlug}
    />
  );
}
