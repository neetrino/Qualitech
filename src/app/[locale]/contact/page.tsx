import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactPage } from "@/features/contact/contact.page";
import { loadContactMessages } from "@/features/contact/contact.messages";
import type { HomeLocale } from "@/features/home/home.messages";
import { loadHomeMessages } from "@/features/home/home.messages";
import { isHomeLocaleSegment } from "@/lib/i18n/locale-routes";

/** ISR seconds (Next.js requires a numeric literal in route modules). */
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
    return { title: "Qualitech Machinery" };
  }
  const contact = await loadContactMessages(raw);
  return {
    title: contact.metaTitle,
    description: contact.metaDescription,
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
  return (
    <ContactPage contactMessages={contactMessages} homeMessages={homeMessages} locale={locale} />
  );
}
