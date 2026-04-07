import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutPage } from "@/features/about/about.page";
import { loadAboutMessages } from "@/features/about/about.messages";
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
  const about = await loadAboutMessages(raw);
  return {
    title: about.metaTitle,
    description: about.metaDescription,
  };
}

export default async function Page({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isHomeLocaleSegment(raw)) {
    notFound();
  }
  const locale: HomeLocale = raw;
  const [homeMessages, aboutMessages] = await Promise.all([loadHomeMessages(locale), loadAboutMessages(locale)]);
  return <AboutPage aboutMessages={aboutMessages} homeMessages={homeMessages} locale={locale} />;
}
