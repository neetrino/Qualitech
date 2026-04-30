import { notFound } from "next/navigation";

import { homeLocaleToAppLocale } from "@/features/blog/blog.locale";
import { HomePage } from "@/features/home/home.page";
import type { HomeLocale } from "@/features/home/home.messages";
import { loadHomeMessages } from "@/features/home/home.messages";
import { listHomeFeaturedMachineCategoryCardsPublic } from "@/features/machines/machines.service";
import { isHomeLocaleSegment } from "@/lib/i18n/locale-routes";

/** ISR seconds (Next.js requires a numeric literal in route modules). */
export const revalidate = 300;

export function generateStaticParams(): { locale: string }[] {
  return [{ locale: "en" }, { locale: "ru" }];
}

type PageProps = {
  readonly params: Promise<{ locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isHomeLocaleSegment(raw)) {
    notFound();
  }
  const locale: HomeLocale = raw;
  const [messages, machineCategories] = await Promise.all([
    loadHomeMessages(locale),
    listHomeFeaturedMachineCategoryCardsPublic(homeLocaleToAppLocale(locale)),
  ]);
  const homeSolutionCategories = machineCategories.slice(0, 3);
  return <HomePage homeSolutionCategories={homeSolutionCategories} locale={locale} messages={messages} />;
}
