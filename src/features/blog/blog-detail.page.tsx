import Image from "next/image";
import Link from "next/link";

import { BLOG_DETAIL_HERO_OVERLAY_MIN_HEIGHT_CLASSNAME } from "@/features/blog/blog.constants";
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

function BlogPostHeroOverlay({
  image,
  fallbackAlt,
  backHref,
  backText,
  breadcrumbSegments,
  dateLabel,
  publishedAtIso,
  title,
  excerpt,
  contentHtml,
}: {
  readonly image: BlogPostImageDto;
  readonly fallbackAlt: string;
  readonly backHref: string;
  readonly backText: string;
  readonly breadcrumbSegments: readonly SiteBreadcrumbSegment[];
  readonly dateLabel: string;
  readonly publishedAtIso: string | null;
  readonly title: string;
  readonly excerpt: string;
  readonly contentHtml: string;
}) {
  const alt = image.alt?.trim() || fallbackAlt;
  const remote = image.url.startsWith("http");
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[#18181b] bg-[#09090b] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)]">
      <div className="absolute inset-0">
        <Image
          alt={alt}
          className="object-cover object-center"
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1200px"
          src={image.url}
          unoptimized={remote}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.72)_22%,rgba(0,0,0,0.88)_55%,rgb(0_0_0)_100%)]"
      />
      <div
        className={`relative z-[1] space-y-5 p-6 sm:p-8 md:p-10 ${BLOG_DETAIL_HERO_OVERLAY_MIN_HEIGHT_CLASSNAME} pb-12 sm:pb-14`}
      >
        <SiteBreadcrumb segments={breadcrumbSegments} />
        <Link
          className="inline-flex w-fit text-[11px] font-black uppercase tracking-[0.12em] text-[#ff6900] transition hover:brightness-110"
          href={backHref}
        >
          ← {backText}
        </Link>
        {dateLabel.length > 0 ? (
          <time
            className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#d4d4d8]"
            dateTime={publishedAtIso ?? undefined}
          >
            {dateLabel}
          </time>
        ) : null}
        <h1 className="max-w-[48rem] font-display text-[clamp(1.35rem,4vw,2.25rem)] uppercase leading-[1.08] tracking-[-0.03em] text-white">
          {title}
        </h1>
        {excerpt.length > 0 ? (
          <p className="max-w-[40rem] text-base leading-relaxed text-[#e4e4e7] sm:text-[17px]">{excerpt}</p>
        ) : null}
        <div className="pt-2">
          <BlogProse html={contentHtml} />
        </div>
      </div>
    </div>
  );
}

/** Extra gallery images after the first (hero) image. */
function ArticleRemainingImagesGrid({
  images,
  fallbackAlt,
}: {
  readonly images: BlogPostImageDto[];
  readonly fallbackAlt: string;
}) {
  if (images.length === 0) {
    return null;
  }
  return (
    <div className="mx-auto grid w-full max-w-[1200px] gap-5 px-4 sm:grid-cols-2 sm:gap-6 sm:px-5 md:px-6 lg:gap-8 lg:px-8 xl:px-10">
      {images.map((img, index) => {
        const alt = img.alt?.trim() || fallbackAlt;
        const remote = img.url.startsWith("http");
        return (
          <div
            key={`${img.url}-${img.sortOrder}`}
            className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[#18181b] bg-[#09090b]"
          >
            <Image
              alt={alt}
              className="object-cover object-center"
              fill
              priority={index === 0}
              sizes="(max-width: 640px) 100vw, 50vw"
              src={img.url}
              unoptimized={remote}
            />
          </div>
        );
      })}
    </div>
  );
}

function StandaloneArticleHeader({
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
    <section className={`mx-auto w-full max-w-[800px] px-4 pb-6 sm:px-5 md:px-6 lg:px-8 xl:px-10 ${HERO_CONTENT_TOP_PAD}`}>
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
    </section>
  );
}

export function BlogDetailPage({ locale, homeMessages, blogMessages, post }: BlogDetailPageProps) {
  const dateLabel = formatBlogPublishedDate(post.publishedAt, locale);
  const hasLeadMedia = post.images.length > 0;
  const heroImage = hasLeadMedia ? post.images[0]! : null;
  const restImages = hasLeadMedia && post.images.length > 1 ? post.images.slice(1) : [];
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
          {heroImage ? (
            <section className={`mx-auto w-full max-w-[1200px] px-4 pb-16 sm:px-5 sm:pb-20 md:px-6 lg:px-8 xl:px-10 ${HERO_CONTENT_TOP_PAD}`}>
              <BlogPostHeroOverlay
                backHref={blogPageHref(locale)}
                backText={blogMessages.backToBlog}
                breadcrumbSegments={detailBreadcrumbSegments}
                contentHtml={post.content}
                dateLabel={dateLabel}
                excerpt={post.excerpt}
                fallbackAlt={blogMessages.galleryFallbackAlt}
                image={heroImage}
                publishedAtIso={post.publishedAt}
                title={post.title}
              />
            </section>
          ) : null}

          {restImages.length > 0 ? (
            <section className="w-full pb-16 pt-8 sm:pb-20 sm:pt-10">
              <ArticleRemainingImagesGrid fallbackAlt={blogMessages.galleryFallbackAlt} images={restImages} />
            </section>
          ) : null}

          {!hasLeadMedia ? (
            <StandaloneArticleHeader
              blogMessages={blogMessages}
              breadcrumbSegments={detailBreadcrumbSegments}
              dateLabel={dateLabel}
              excerpt={post.excerpt}
              locale={locale}
              publishedAtIso={post.publishedAt}
              title={post.title}
            />
          ) : null}

          {!hasLeadMedia ? (
            <section className="mx-auto max-w-[800px] px-4 pb-20 sm:px-5 md:px-6 lg:px-8 xl:px-10">
              <div className="border-t border-[#18181b] pt-10">
                <BlogProse html={post.content} />
              </div>
            </section>
          ) : null}
        </article>
        <Footer locale={locale} messages={homeMessages} />
      </div>
    </main>
  );
}
