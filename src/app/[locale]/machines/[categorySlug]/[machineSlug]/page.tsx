import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { AppLocale } from "@prisma/client";

import { homeLocaleToAppLocale } from "@/features/blog/blog.locale";
import { MachineDetailPage } from "@/features/machines/machine-detail.page";
import { loadMachinesMessages } from "@/features/machines/machines.messages";
import {
  getMachineBySlugPublic,
  getMachineBySlugPublicUncached,
  getMachineDetailForSectionPublic,
  listRelatedMachinesInSectionPublic,
} from "@/features/machines/machines.service";
import type { HomeLocale } from "@/features/home/home.messages";
import { loadHomeMessages } from "@/features/home/home.messages";
import { isHomeLocaleSegment, machineDetailHref } from "@/lib/i18n/locale-routes";
import { htmlToPlainText } from "@/lib/html/html-to-plain-excerpt";
import { SITE_TAB_TITLE } from "@/lib/site-metadata";

/** ISR seconds; keep in sync with `MACHINES_PUBLIC_REVALIDATE_SEC`. */
export const revalidate = 60;

function decodePathSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

type PageProps = {
  readonly params: Promise<{ locale: string; categorySlug: string; machineSlug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw, machineSlug: rawMachineSlug } = await params;
  if (!isHomeLocaleSegment(raw)) {
    return { title: SITE_TAB_TITLE };
  }
  const appLocale = homeLocaleToAppLocale(raw);
  const machineSlug = decodePathSegment(rawMachineSlug);
  const detail = await getMachineBySlugPublic(machineSlug, appLocale);
  const m = await loadMachinesMessages(raw);
  if (!detail) {
    return { title: SITE_TAB_TITLE, description: m.metaDescription };
  }
  const plainFromBody = htmlToPlainText(detail.description);
  const metaFromField = detail.metaDescription?.trim() ?? "";
  const metaDesc =
    metaFromField.length > 0
      ? metaFromField
      : plainFromBody.length > 0
        ? plainFromBody
        : undefined;
  return {
    title: SITE_TAB_TITLE,
    ...(metaDesc !== undefined ? { description: metaDesc } : {}),
    openGraph: detail.ogImageUrl
      ? { images: [{ url: detail.ogImageUrl, alt: detail.title }] }
      : undefined,
  };
}

export default async function Page({ params }: PageProps) {
  const { locale: raw, categorySlug: rawCategorySlug, machineSlug: rawMachineSlug } = await params;
  if (!isHomeLocaleSegment(raw)) {
    notFound();
  }
  const locale: HomeLocale = raw;
  const appLocale = homeLocaleToAppLocale(locale);
  const categorySlug = decodePathSegment(rawCategorySlug);
  const machineSlug = decodePathSegment(rawMachineSlug);
  const payload = await getMachineDetailForSectionPublic(machineSlug, categorySlug, appLocale);
  if (!payload) {
    let loose = await getMachineBySlugPublicUncached(machineSlug, appLocale);
    if (!loose && appLocale === AppLocale.en) {
      loose = await getMachineBySlugPublicUncached(machineSlug, AppLocale.ru);
      if (loose?.category?.slug) {
        redirect(machineDetailHref("ru", loose.category.slug.trim(), machineSlug));
      }
    }
    if (!loose && appLocale === AppLocale.ru) {
      loose = await getMachineBySlugPublicUncached(machineSlug, AppLocale.en);
      if (loose?.category?.slug) {
        redirect(machineDetailHref("en", loose.category.slug.trim(), machineSlug));
      }
    }
    const catSlug = loose?.category?.slug?.trim();
    if (catSlug && catSlug !== categorySlug) {
      redirect(machineDetailHref(locale, catSlug, machineSlug));
    }
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
