import Image from "next/image";
import Link from "next/link";

import { BLOG_LIST_INDEX_EXTRA_TOP_SPACING } from "@/features/blog/blog.constants";
import type { BlogPostListItemDto } from "@/features/blog/blog.dto";
import { formatBlogPublishedDate } from "@/features/blog/blog.format-date";
import type { BlogMessages } from "@/features/blog/blog.messages";
import { HERO_CONTENT_TOP_PAD } from "@/features/home/home-hero-visual";
import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";
import { blogPostHref, homePageHref } from "@/lib/i18n/locale-routes";
import { Footer } from "@/shared/layout/footer";
import { Header } from "@/shared/layout/header";
import { SiteBreadcrumb } from "@/shared/layout/site-breadcrumb";

type BlogListPageProps = {
  readonly locale: HomeLocale;
  readonly homeMessages: HomeMessages;
  readonly blogMessages: BlogMessages;
  readonly posts: BlogPostListItemDto[];
  readonly page: number;
  readonly totalPages: number;
  readonly total: number;
};

function BlogPostCard({
  post,
  locale,
  messages,
}: {
  readonly post: BlogPostListItemDto;
  readonly locale: HomeLocale;
  readonly messages: BlogMessages;
}) {
  const dateLabel = formatBlogPublishedDate(post.publishedAt, locale);
  const href = blogPostHref(locale, post.slug);
  const alt = post.coverImage?.alt?.trim() || messages.cardFallbackAlt;

  return (
    <article className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[#18181b] bg-black p-px transition hover:border-[#27272a]">
      <Link className="relative block h-[200px] shrink-0 overflow-hidden rounded-t-[12px] bg-[#18181b] sm:h-[220px]" href={href}>
        {post.coverImage ? (
          <Image
            alt={alt}
            className="object-cover transition duration-300 hover:scale-[1.02]"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            src={post.coverImage.url}
            unoptimized={post.coverImage.url.startsWith("http")}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#18181b_0%,#09090b_100%)] text-[11px] font-bold uppercase tracking-[0.14em] text-[#52525c]">
            Qualitech
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-[rgba(0,0,0,0.35)] to-transparent" />
      </Link>
      <div className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-5 sm:py-6">
        {dateLabel.length > 0 ? (
          <time className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#71717b]" dateTime={post.publishedAt ?? undefined}>
            {dateLabel}
          </time>
        ) : null}
        <h2 className="mt-3 font-display text-lg uppercase leading-snug tracking-tight text-white sm:text-xl">
          <Link className="transition hover:text-[#ff6900]" href={href}>
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 min-h-0 flex-1 text-sm leading-relaxed text-[#9f9fa9]">{post.excerpt}</p>
        <Link
          className="mt-5 inline-flex shrink-0 items-center gap-1.5 self-start text-[11px] font-black uppercase tracking-[0.12em] text-[#ff6900] transition hover:brightness-110 sm:text-xs"
          href={href}
        >
          {messages.readArticle}
        </Link>
      </div>
    </article>
  );
}

function Pagination({
  locale,
  page,
  totalPages,
  messages,
}: {
  readonly locale: HomeLocale;
  readonly page: number;
  readonly totalPages: number;
  readonly messages: BlogMessages;
}) {
  if (totalPages <= 1) {
    return null;
  }
  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;
  const base = `/${locale}/blog`;

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#18181b] pt-8">
      <p className="text-xs text-[#71717b]">
        {messages.pageIndicator.replace("{page}", String(page)).replace("{totalPages}", String(totalPages))}
      </p>
      <div className="flex gap-3">
        {prev !== null ? (
          <Link
            className="rounded-full border border-[#27272a] px-4 py-2 text-[11px] font-black uppercase tracking-[0.1em] text-white transition hover:border-[#ff6900] hover:text-[#ff6900]"
            href={prev === 1 ? base : `${base}?page=${prev}`}
          >
            {messages.paginationPrev}
          </Link>
        ) : (
          <span className="rounded-full border border-transparent px-4 py-2 text-[11px] font-black uppercase tracking-[0.1em] text-[#3f3f46]">
            {messages.paginationPrev}
          </span>
        )}
        {next !== null ? (
          <Link
            className="rounded-full border border-[#27272a] px-4 py-2 text-[11px] font-black uppercase tracking-[0.1em] text-white transition hover:border-[#ff6900] hover:text-[#ff6900]"
            href={`${base}?page=${next}`}
          >
            {messages.paginationNext}
          </Link>
        ) : (
          <span className="rounded-full border border-transparent px-4 py-2 text-[11px] font-black uppercase tracking-[0.1em] text-[#3f3f46]">
            {messages.paginationNext}
          </span>
        )}
      </div>
    </nav>
  );
}

export function BlogListPage({ locale, homeMessages, blogMessages, posts, page, totalPages, total }: BlogListPageProps) {
  return (
    <main className="relative bg-[linear-gradient(201deg,#252525_14.56%,#000_90.79%)] text-white">
      <Header blogListPage={page} locale={locale} messages={homeMessages} navContext="site" />
      <div className="overflow-x-hidden">
        <section
          className={`mx-auto max-w-[1280px] px-4 pb-20 sm:px-5 md:px-6 lg:px-8 xl:max-w-[1360px] xl:px-10 ${HERO_CONTENT_TOP_PAD}`}
        >
          <div className={BLOG_LIST_INDEX_EXTRA_TOP_SPACING}>
            <SiteBreadcrumb
              segments={[
                { label: homeMessages.nav.home, href: homePageHref(locale) },
                { label: homeMessages.nav.blog },
              ]}
            />
            {total === 0 ? (
              <div className="rounded-2xl border border-[#18181b] bg-[#09090b] px-6 py-14 text-center sm:px-10">
                <h2 className="font-display text-xl uppercase tracking-tight text-white">{blogMessages.emptyTitle}</h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-[#9f9fa9]">{blogMessages.emptyBody}</p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-3">
                  {posts.map((post) => (
                    <BlogPostCard key={post.id} locale={locale} messages={blogMessages} post={post} />
                  ))}
                </div>
                <Pagination locale={locale} messages={blogMessages} page={page} totalPages={totalPages} />
              </>
            )}
          </div>
        </section>

        <Footer locale={locale} messages={homeMessages} />
      </div>
    </main>
  );
}
