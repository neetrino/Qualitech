import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogDetailPage } from "@/features/blog/blog-detail.page";
import { homeLocaleToAppLocale } from "@/features/blog/blog.locale";
import { loadBlogMessages } from "@/features/blog/blog.messages";
import { getBlogPostBySlugPublic } from "@/features/blog/blog.service";
import type { HomeLocale } from "@/features/home/home.messages";
import { loadHomeMessages } from "@/features/home/home.messages";
import { isHomeLocaleSegment } from "@/lib/i18n/locale-routes";
import { SITE_TAB_TITLE } from "@/lib/site-metadata";

/** ISR seconds; keep in sync with `BLOG_PUBLIC_DATA_REVALIDATE_SEC` (Next requires a literal here). */
export const revalidate = 60;

type PageProps = {
  readonly params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isHomeLocaleSegment(raw)) {
    return { title: SITE_TAB_TITLE };
  }
  const post = await getBlogPostBySlugPublic(slug, homeLocaleToAppLocale(raw));
  if (!post) {
    return { title: SITE_TAB_TITLE };
  }
  return {
    title: SITE_TAB_TITLE,
    description: post.metaDescription ?? post.excerpt,
  };
}

export default async function Page({ params }: PageProps) {
  const { locale: raw, slug } = await params;
  if (!isHomeLocaleSegment(raw)) {
    notFound();
  }
  const locale: HomeLocale = raw;
  const post = await getBlogPostBySlugPublic(slug, homeLocaleToAppLocale(locale));
  if (!post) {
    notFound();
  }
  const [homeMessages, blogMessages] = await Promise.all([loadHomeMessages(locale), loadBlogMessages(locale)]);
  return <BlogDetailPage blogMessages={blogMessages} homeMessages={homeMessages} locale={locale} post={post} />;
}
