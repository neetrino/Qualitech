import Image from "next/image";
import Link from "next/link";

import type { MachineListItemDto } from "@/features/machines/machines.dto";
import type { MachinesMessages } from "@/features/machines/machines.messages";
import { HERO_CONTENT_TOP_PAD, HeroBackgroundLayers } from "@/features/home/home-hero-visual";
import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";
import { isRemoteImageUrl } from "@/lib/image/remote-image-url";
import { machineDetailHref, machinesCategoryHref, machinesPageHref } from "@/lib/i18n/locale-routes";
import { Footer } from "@/shared/layout/footer";
import { Header } from "@/shared/layout/header";

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
};

function MachineCard({
  locale,
  sectionSlug,
  messages,
  machine,
}: {
  readonly locale: HomeLocale;
  readonly sectionSlug: string;
  readonly messages: MachinesMessages;
  readonly machine: MachineListItemDto;
}) {
  const href = machineDetailHref(locale, sectionSlug, machine.slug);
  const alt = machine.coverImage?.alt?.trim() || messages.cardFallbackAlt;
  const coverSrc = machine.coverImage?.url?.trim() ?? "";
  const showCover = coverSrc.length > 0;

  return (
    <article className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[#18181b] bg-black p-px transition hover:border-[#27272a]">
      <Link className="relative block h-[200px] shrink-0 overflow-hidden rounded-t-[12px] bg-[#18181b] sm:h-[220px]" href={href}>
        {showCover ? (
          <Image
            alt={alt}
            className="object-cover transition duration-300 hover:scale-[1.02]"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            src={coverSrc}
            unoptimized={isRemoteImageUrl(coverSrc)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#18181b_0%,#09090b_100%)] text-[11px] font-bold uppercase tracking-[0.14em] text-[#52525c]">
            Qualitech
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-[rgba(0,0,0,0.35)] to-transparent" />
      </Link>
      <div className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-5 sm:py-6">
        <h2 className="font-display text-lg uppercase leading-snug tracking-tight text-white sm:text-xl">
          <Link className="transition hover:text-[#ff6900]" href={href}>
            {machine.title}
          </Link>
        </h2>
        <p className="mt-3 min-h-0 flex-1 text-sm leading-relaxed text-[#9f9fa9]">{machine.shortDescription}</p>
        <Link
          className="mt-5 inline-flex shrink-0 items-center gap-1.5 self-start text-[11px] font-black uppercase tracking-[0.12em] text-[#ff6900] transition hover:brightness-110 sm:text-xs"
          href={href}
        >
          {messages.readDetails}
        </Link>
      </div>
    </article>
  );
}

function Pagination({
  locale,
  sectionSlug,
  page,
  totalPages,
  messages,
}: {
  readonly locale: HomeLocale;
  readonly sectionSlug: string;
  readonly page: number;
  readonly totalPages: number;
  readonly messages: MachinesMessages;
}) {
  if (totalPages <= 1) {
    return null;
  }
  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;
  const base = machinesCategoryHref(locale, sectionSlug);

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
}: MachinesCategoryPageProps) {
  return (
    <main className="relative bg-[linear-gradient(201deg,#252525_14.56%,#000_90.79%)] text-white">
      <Header
        locale={locale}
        machineSectionSlugByLocale={machineSectionSlugByLocale}
        messages={homeMessages}
        navContext="site"
      />
      <div className="overflow-x-hidden">
        <section className="relative min-h-[min(44svh,380px)] overflow-hidden lg:min-h-[340px]">
          <HeroBackgroundLayers />
          <div
            className={`relative z-[2] mx-auto flex w-full max-w-[1380px] flex-col px-4 pb-10 sm:px-5 sm:pb-12 md:px-6 lg:px-8 xl:px-10 ${HERO_CONTENT_TOP_PAD}`}
          >
            <nav aria-label="Breadcrumb" className="mb-6 text-[11px] font-medium uppercase tracking-[0.12em] text-[#71717b]">
              <Link className="text-[#ff6900] transition hover:brightness-110" href={machinesPageHref(locale)}>
                {machinesMessages.breadcrumbMachines}
              </Link>
              <span className="mx-2 text-[#3f3f46]" aria-hidden>
                /
              </span>
              <span className="text-[#d4d4d8]">{sectionName}</span>
            </nav>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-px w-10 rounded-full bg-[#ff6900]" />
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ff6900] sm:text-xs">{machinesMessages.heroEyebrow}</p>
            </div>
            <h1 className="max-w-[720px] font-display text-[clamp(1.5rem,4.2vw,2.75rem)] uppercase leading-[1.05] tracking-[-0.04em] text-white">
              {sectionName}
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 pb-20 pt-4 sm:px-5 md:px-6 lg:px-8 xl:max-w-[1360px] xl:px-10">
          {total === 0 ? (
            <div className="rounded-2xl border border-[#18181b] bg-[#09090b] px-6 py-14 text-center sm:px-10">
              <h2 className="font-display text-xl uppercase tracking-tight text-white">{machinesMessages.sectionEmptyTitle}</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-[#9f9fa9]">{machinesMessages.sectionEmptyBody}</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-3">
                {machines.map((m) => (
                  <MachineCard key={m.id} locale={locale} machine={m} messages={machinesMessages} sectionSlug={sectionSlug} />
                ))}
              </div>
              <Pagination
                locale={locale}
                messages={machinesMessages}
                page={page}
                sectionSlug={sectionSlug}
                totalPages={totalPages}
              />
            </>
          )}
        </section>

        <Footer messages={homeMessages} />
      </div>
    </main>
  );
}
