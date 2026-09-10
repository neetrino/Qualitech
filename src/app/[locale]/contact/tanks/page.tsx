import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactThanksPage } from "@/features/contact/contact-thanks.page";
import { loadContactMessages } from "@/features/contact/contact.messages";
import type { HomeLocale } from "@/features/home/home.messages";
import { loadHomeMessages } from "@/features/home/home.messages";
import { isHomeLocaleSegment } from "@/lib/i18n/locale-routes";
import { SITE_TAB_TITLE } from "@/lib/site-metadata";

export const revalidate = 300;

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
  const contact = await loadContactMessages(raw);
  return {
    title: `${contact.thanks.title} | Qualitech Machinery`,
    description: contact.thanks.subtitle,
  };
}

export default async function Page({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isHomeLocaleSegment(raw)) {
    notFound();
  }
  const locale: HomeLocale = raw;
  const [homeMessages, contactMessages] = await Promise.all([
    loadHomeMessages(locale),
    loadContactMessages(locale),
  ]);
  return <ContactThanksPage contactMessages={contactMessages} homeMessages={homeMessages} locale={locale} />;
}
