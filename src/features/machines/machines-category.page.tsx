import Link from "next/link";

import type { MachineListItemDto } from "@/features/machines/machines.dto";
import { machinesCategoryListHref } from "@/features/machines/machines-category-list-url";
import { MachineListCard } from "@/features/machines/machine-list-card";
import type { MachinesMessages } from "@/features/machines/machines.messages";
import { HERO_CONTENT_TOP_PAD, HOME_PAGE_BACKGROUND_CLASS } from "@/features/home/home-hero-visual";
import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";
import { homePageHref, machinesPageHref } from "@/lib/i18n/locale-routes";
import { Footer } from "@/shared/layout/footer";
import { Header } from "@/shared/layout/header";
import { SiteBreadcrumb } from "@/shared/layout/site-breadcrumb";

type MachinesCategoryPageProps = {
  readonly locale: HomeLocale;
  readonly homeMessages: HomeMessages;
  readonly machinesMessages: MachinesMessages;
  readonly sectionSlug: string;
  readonly sectionName: string;
  readonly machineSectionSlugByLocale: Partial<Record<HomeLocale, string>>;
  readonly machines: MachineListItemDto[];
  readonly page: number;
  readonly totalPages: number;
  readonly total: number;
  readonly featuredOnly: boolean;
};

function filterPillClass(active: boolean): string {
  return active
    ? "border-[#ff6900] bg-[#ff6900]/10 text-[#ff6900]"
    : "border-[#27272a] text-white hover:border-[#ff6900] hover:text-[#ff6900]";
}

function ListingFilters({
  locale,
  sectionSlug,
  featuredOnly,
  messages,
}: {
  readonly locale: HomeLocale;
  readonly sectionSlug: string;
  readonly featuredOnly: boolean;
  readonly messages: MachinesMessages;
}) {
  const allHref = machinesCategoryListHref(locale, sectionSlug, { page: 1, featuredOnly: false });
  const featHref = machinesCategoryListHref(locale, sectionSlug, { page: 1, featuredOnly: true });
  return (
    <nav
      aria-label={messages.filterLabel}
      className="mb-8 flex flex-col gap-4 border-b border-[#18181b] pb-8 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#71717b]">{messages.filterLabel}</p>
      <div className="flex flex-wrap gap-2">
        <Link
          aria-current={!featuredOnly ? "page" : undefined}
          className={`rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.1em] transition ${filterPillClass(!featuredOnly)}`}
          href={allHref}
        >
          {messages.filterAll}
        </Link>
        <Link
          aria-current={featuredOnly ? "page" : undefined}
          className={`rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.1em] transition ${filterPillClass(featuredOnly)}`}
          href={featHref}
        >
          {messages.filterFeatured}
        </Link>
      </div>
    </nav>
  );
}

function Pagination({
  locale,
  sectionSlug,
  page,
  totalPages,
  featuredOnly,
  messages,
}: {
  readonly locale: HomeLocale;
  readonly sectionSlug: string;
  readonly page: number;
  readonly totalPages: number;
  readonly featuredOnly: boolean;
  readonly messages: MachinesMessages;
}) {
  if (totalPages <= 1) {
    return null;
  }
  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;
  const prevHref = machinesCategoryListHref(locale, sectionSlug, { page: prev ?? 1, featuredOnly });
  const nextHref = machinesCategoryListHref(locale, sectionSlug, { page: next ?? page, featuredOnly });

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#18181b] pt-8">
      <p className="text-xs text-[#71717b]">
        {messages.pageIndicator.replace("{page}", String(page)).replace("{totalPages}", String(totalPages))}
      </p>
      <div className="flex gap-3">
        {prev !== null ? (
          <Link
            className="rounded-full border border-[#27272a] px-4 py-2 text-[11px] font-black uppercase tracking-[0.1em] text-white transition hover:border-[#ff6900] hover:text-[#ff6900]"
            href={prevHref}
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
            href={nextHref}
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

export function MachinesCategoryPage({
  locale,
  homeMessages,
  machinesMessages,
  sectionSlug,
  sectionName,
  machineSectionSlugByLocale,
  machines,
  page,
  totalPages,
  total,
  featuredOnly,
}: MachinesCategoryPageProps) {
  return (
    <main className={`relative ${HOME_PAGE_BACKGROUND_CLASS} text-white`}>
      <Header
        locale={locale}
        machineSectionSlugByLocale={machineSectionSlugByLocale}
        messages={homeMessages}
        navContext="site"
      />
      <div className="overflow-x-hidden">
        <section
          className={`mx-auto max-w-[1280px] px-4 pb-20 sm:px-5 md:px-6 lg:px-8 xl:max-w-[1360px] xl:px-10 ${HERO_CONTENT_TOP_PAD} mt-6 sm:mt-8`}
        >
          <SiteBreadcrumb
            segments={[
              { label: homeMessages.nav.home, href: homePageHref(locale) },
              { label: homeMessages.nav.machines, href: machinesPageHref(locale) },
              { label: sectionName },
            ]}
          />
          <header className="mb-6 sm:mb-8">
            <h1 className="font-display text-2xl uppercase leading-tight tracking-tight text-white sm:text-3xl lg:text-[2rem]">
              {sectionName}
            </h1>
          </header>

          <ListingFilters featuredOnly={featuredOnly} locale={locale} messages={machinesMessages} sectionSlug={sectionSlug} />

          {total === 0 ? (
            <div className="rounded-2xl border border-[#18181b] bg-[#09090b] px-6 py-14 text-center sm:px-10">
              <h2 className="font-display text-xl uppercase tracking-tight text-white">
                {featuredOnly ? machinesMessages.filterEmptyFeaturedTitle : machinesMessages.sectionEmptyTitle}
              </h2>
              {!featuredOnly ? (
                <p className="mx-auto mt-3 max-w-md text-sm text-[#9f9fa9]">{machinesMessages.sectionEmptyBody}</p>
              ) : null}
              {featuredOnly ? (
                <Link
                  className="mt-6 inline-flex text-xs font-black uppercase tracking-[0.12em] text-[#ff6900] transition hover:brightness-110"
                  href={machinesCategoryListHref(locale, sectionSlug, { page: 1, featuredOnly: false })}
                >
                  {machinesMessages.filterShowAllLink}
                </Link>
              ) : null}
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-5">
                {machines.map((m) => (
                  <MachineListCard key={m.id} locale={locale} machine={m} messages={machinesMessages} sectionSlug={sectionSlug} />
                ))}
              </div>
              <Pagination
                featuredOnly={featuredOnly}
                locale={locale}
                messages={machinesMessages}
                page={page}
                sectionSlug={sectionSlug}
                totalPages={totalPages}
              />
            </>
          )}
        </section>

        <Footer locale={locale} messages={homeMessages} />
      </div>
    </main>
  );
}
