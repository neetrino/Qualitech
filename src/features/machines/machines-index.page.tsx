import Image from "next/image";
import Link from "next/link";

import type { MachineCategoryCardDto } from "@/features/machines/machines.dto";
import type { MachinesMessages } from "@/features/machines/machines.messages";
import { HERO_CONTENT_TOP_PAD } from "@/features/home/home-hero-visual";
import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";
import { isRemoteImageUrl } from "@/lib/image/remote-image-url";
import { homePageHref, machinesCategoryHref } from "@/lib/i18n/locale-routes";
import { Footer } from "@/shared/layout/footer";
import { Header } from "@/shared/layout/header";
import { SiteBreadcrumb } from "@/shared/layout/site-breadcrumb";

type MachinesIndexPageProps = {
  readonly locale: HomeLocale;
  readonly homeMessages: HomeMessages;
  readonly machinesMessages: MachinesMessages;
  readonly categories: MachineCategoryCardDto[];
};

function CategoryCard({
  locale,
  messages,
  category,
}: {
  readonly locale: HomeLocale;
  readonly messages: MachinesMessages;
  readonly category: MachineCategoryCardDto;
}) {
  const href = machinesCategoryHref(locale, category.slug);
  const alt = category.coverImage?.alt?.trim() || messages.cardFallbackAlt;
  const coverSrc = category.coverImage?.url?.trim() ?? "";
  const showCover = coverSrc.length > 0;

  return (
    <article className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[#18181b] bg-black p-px transition hover:border-[#27272a]">
      <Link
        className="relative block h-[260px] shrink-0 overflow-hidden rounded-t-[14px] bg-[#18181b] sm:h-[300px] lg:h-[340px]"
        href={href}
      >
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
      <div className="flex min-h-0 flex-1 flex-col px-5 py-6 sm:px-6 sm:py-8">
        <h2 className="font-display text-xl uppercase leading-snug tracking-tight text-white sm:text-2xl lg:text-[1.65rem]">
          <Link className="transition hover:text-[#ff6900]" href={href}>
            {category.name}
          </Link>
        </h2>
        <Link
          className="mt-6 inline-flex shrink-0 items-center gap-1.5 self-start text-xs font-black uppercase tracking-[0.12em] text-[#ff6900] transition hover:brightness-110 sm:text-[13px]"
          href={href}
        >
          {messages.readDetails}
        </Link>
      </div>
    </article>
  );
}

export function MachinesIndexPage({ locale, homeMessages, machinesMessages, categories }: MachinesIndexPageProps) {
  return (
    <main className="relative bg-[linear-gradient(201deg,#252525_14.56%,#000_90.79%)] text-white">
      <Header locale={locale} messages={homeMessages} navContext="site" />
      <div className="overflow-x-hidden">
        <section
          className={`mx-auto max-w-[1280px] px-4 pb-20 sm:px-5 md:px-6 lg:px-8 xl:max-w-[1360px] xl:px-10 ${HERO_CONTENT_TOP_PAD} mt-6 sm:mt-8`}
        >
          <SiteBreadcrumb
            segments={[
              { label: homeMessages.nav.home, href: homePageHref(locale) },
              { label: homeMessages.nav.machines },
            ]}
          />
          {categories.length === 0 ? (
            <div className="rounded-2xl border border-[#18181b] bg-[#09090b] px-6 py-14 text-center sm:px-10">
              <h2 className="font-display text-xl uppercase tracking-tight text-white">{machinesMessages.emptyTitle}</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-[#9f9fa9]">{machinesMessages.emptyBody}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10">
              {categories.map((c) => (
                <CategoryCard key={c.slug} category={c} locale={locale} messages={machinesMessages} />
              ))}
            </div>
          )}
        </section>

        <Footer messages={homeMessages} />
      </div>
    </main>
  );
}
