import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { BLOG_LIST_DEFAULT_LIMIT } from "@/features/blog/blog.constants";
import { homeLocaleToAppLocale } from "@/features/blog/blog.locale";
import { BlogListPage } from "@/features/blog/blog-list.page";
import { loadBlogMessages } from "@/features/blog/blog.messages";
import { listBlogPostsPublic } from "@/features/blog/blog.service";
import type { HomeLocale } from "@/features/home/home.messages";
import { loadHomeMessages } from "@/features/home/home.messages";
import { blogPageHref, isHomeLocaleSegment } from "@/lib/i18n/locale-routes";
import { SITE_TAB_TITLE } from "@/lib/site-metadata";

/** ISR seconds; keep in sync with `BLOG_PUBLIC_DATA_REVALIDATE_SEC` (Next requires a literal here). */
export const revalidate = 60;

export function generateStaticParams(): { locale: string }[] {
  return [{ locale: "en" }, { locale: "ru" }];
}

type PageProps = {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<{ page?: string }>;
};

function parseListPage(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? "1", 10);
  if (!Number.isFinite(n) || n < 1) {
    return 1;
  }
  return n;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isHomeLocaleSegment(raw)) {
    return { title: SITE_TAB_TITLE };
  }
  const blog = await loadBlogMessages(raw);
  return {
    title: SITE_TAB_TITLE,
    description: blog.metaDescription,
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale: raw } = await params;
  if (!isHomeLocaleSegment(raw)) {
    notFound();
  }
  const locale: HomeLocale = raw;
  const sp = await searchParams;
  const page = parseListPage(sp.page);
  const [homeMessages, blogMessages, result] = await Promise.all([
    loadHomeMessages(locale),
    loadBlogMessages(locale),
    listBlogPostsPublic({
      locale: homeLocaleToAppLocale(locale),
      page,
      limit: BLOG_LIST_DEFAULT_LIMIT,
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(result.meta.total / result.meta.limit));
  if (result.meta.total === 0 && page > 1) {
    redirect(blogPageHref(locale));
  }
  if (result.meta.total > 0 && page > totalPages) {
    redirect(totalPages > 1 ? `${blogPageHref(locale)}?page=${totalPages}` : blogPageHref(locale));
  }
  return (
    <BlogListPage
      blogMessages={blogMessages}
      homeMessages={homeMessages}
      locale={locale}
      page={page}
      posts={result.data}
      total={result.meta.total}
      totalPages={totalPages}
    />
  );
}
