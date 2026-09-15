import Link from "next/link";

import { BlogArticleFigure } from "@/features/blog/blog-article-figure";
import {
  dropBlocksCoveredByExcerpt,
  getBlogInlineImageInsertIndex,
  joinBlogContentBlocks,
  splitBlogContentBlocks,
} from "@/features/blog/blog-content-blocks";
import type { BlogPostDetailDto, BlogPostImageDto } from "@/features/blog/blog.dto";
import { formatBlogPublishedDate } from "@/features/blog/blog.format-date";
import type { BlogMessages } from "@/features/blog/blog.messages";
import { BlogProse } from "@/features/blog/blog-prose";
import { HERO_CONTENT_TOP_PAD, HOME_PAGE_BACKGROUND_CLASS } from "@/features/home/home-hero-visual";
import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";
import { blogPageHref, homePageHref } from "@/lib/i18n/locale-routes";
import { Footer } from "@/shared/layout/footer";
import { MOBILE_BOTTOM_TAB_BAR_PAD } from "@/shared/layout/mobile-tab-bar.constants";
import { SiteHeader } from "@/shared/layout/site-header";
import { type SiteBreadcrumbSegment, SiteBreadcrumb } from "@/shared/layout/site-breadcrumb";

type BlogDetailPageProps = {
  readonly locale: HomeLocale;
  readonly homeMessages: HomeMessages;
  readonly blogMessages: BlogMessages;
  readonly post: BlogPostDetailDto;
};

function ArticleHeader({
  blogMessages,
  breadcrumbSegments,
  dateLabel,
  locale,
  publishedAtIso,
  title,
  excerpt,
}: {
  readonly blogMessages: BlogMessages;
  readonly breadcrumbSegments: readonly SiteBreadcrumbSegment[];
  readonly dateLabel: string;
  readonly locale: HomeLocale;
  readonly publishedAtIso: string | null;
  readonly title: string;
  readonly excerpt: string;
}) {
  return (
    <header className={`mx-auto w-full max-w-[800px] px-4 pb-6 sm:px-5 md:px-6 lg:px-8 xl:px-10 ${HERO_CONTENT_TOP_PAD}`}>
      <SiteBreadcrumb segments={breadcrumbSegments} />
      <Link
        className="inline-flex text-[11px] font-black uppercase tracking-[0.12em] text-[#ff6900] transition hover:brightness-110"
        href={blogPageHref(locale)}
      >
        ← {blogMessages.backToBlog}
      </Link>
      {dateLabel.length > 0 ? (
        <time className="mt-6 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#71717b]" dateTime={publishedAtIso ?? undefined}>
          {dateLabel}
        </time>
      ) : null}
      <h1 className="mt-3 font-display text-[clamp(1.35rem,4vw,2.25rem)] uppercase leading-[1.08] tracking-[-0.03em] text-white">
        {title}
      </h1>
      {excerpt.length > 0 ? (
        <p className="mt-4 text-base leading-relaxed text-[#9f9fa9] sm:text-[17px]">{excerpt}</p>
      ) : null}
    </header>
  );
}

function ArticleBody({
  contentHtml,
  excerpt,
  fallbackAlt,
  images,
}: {
  readonly contentHtml: string;
  readonly excerpt: string;
  readonly fallbackAlt: string;
  readonly images: readonly BlogPostImageDto[];
}) {
  const blocks = dropBlocksCoveredByExcerpt(splitBlogContentBlocks(contentHtml), excerpt);
  const leadImage = images[0] ?? null;
  const restImages = images.slice(1);
  const insertAt = leadImage ? getBlogInlineImageInsertIndex(blocks) : blocks.length;
  const beforeHtml = joinBlogContentBlocks(blocks.slice(0, insertAt));
  const afterHtml = joinBlogContentBlocks(blocks.slice(insertAt));

  return (
    <section className="mx-auto max-w-[800px] px-4 pb-20 sm:px-5 md:px-6 lg:px-8 xl:px-10">
      <div className="border-t border-[#18181b] pt-10">
        {beforeHtml.length > 0 ? <BlogProse html={beforeHtml} /> : null}
        {leadImage ? <BlogArticleFigure fallbackAlt={fallbackAlt} image={leadImage} /> : null}
        {afterHtml.length > 0 ? <BlogProse html={afterHtml} /> : null}
        {restImages.map((image) => (
          <BlogArticleFigure fallbackAlt={fallbackAlt} image={image} key={`${image.url}-${image.sortOrder}`} />
        ))}
      </div>
    </section>
  );
}

export function BlogDetailPage({ locale, homeMessages, blogMessages, post }: BlogDetailPageProps) {
  const dateLabel = formatBlogPublishedDate(post.publishedAt, locale);
  const detailBreadcrumbSegments: readonly SiteBreadcrumbSegment[] = [
    { label: homeMessages.nav.home, href: homePageHref(locale) },
    { label: homeMessages.nav.blog, href: blogPageHref(locale) },
    { label: post.title },
  ];

  return (
    <main className={`relative ${HOME_PAGE_BACKGROUND_CLASS} text-white ${MOBILE_BOTTOM_TAB_BAR_PAD}`}>
      <SiteHeader
        blogSlugByLocale={post.slugByLocale}
        locale={locale}
        messages={homeMessages}
        navContext="site"
      />
      <div className="overflow-x-hidden">
        <article>
          <ArticleHeader
            blogMessages={blogMessages}
            breadcrumbSegments={detailBreadcrumbSegments}
            dateLabel={dateLabel}
            excerpt={post.excerpt}
            locale={locale}
            publishedAtIso={post.publishedAt}
            title={post.title}
          />
          <ArticleBody
            contentHtml={post.content}
            excerpt={post.excerpt}
            fallbackAlt={blogMessages.galleryFallbackAlt}
            images={post.images}
          />
        </article>
        <Footer locale={locale} messages={homeMessages} />
      </div>
    </main>
  );
}
