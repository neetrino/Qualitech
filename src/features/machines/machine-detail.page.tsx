import Link from "next/link";

import { BlogProse } from "@/features/blog/blog-prose";
import { MachineHeroGallery } from "@/features/machines/machine-hero-gallery.client";
import type { MachineDetailWithLocaleSlugs, MachineListItemDto } from "@/features/machines/machines.dto";
import { MachineRelatedCarousel } from "@/features/machines/machine-related-carousel";
import type { MachinesMessages } from "@/features/machines/machines.messages";
import { HERO_CONTENT_TOP_PAD, HOME_PAGE_BACKGROUND_CLASS } from "@/features/home/home-hero-visual";
import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";
import { homePageHref, machinesCategoryHref, machinesPageHref } from "@/lib/i18n/locale-routes";
import { Footer } from "@/shared/layout/footer";
import { MOBILE_BOTTOM_TAB_BAR_PAD } from "@/shared/layout/mobile-tab-bar.constants";
import { SiteHeader } from "@/shared/layout/site-header";
import { SiteBreadcrumb } from "@/shared/layout/site-breadcrumb";

type MachineDetailPageProps = {
  readonly locale: HomeLocale;
  readonly homeMessages: HomeMessages;
  readonly machinesMessages: MachinesMessages;
  readonly sectionSlug: string;
  readonly payload: MachineDetailWithLocaleSlugs;
  readonly relatedProducts: MachineListItemDto[];
};

export function MachineDetailPage({
  locale,
  homeMessages,
  machinesMessages,
  sectionSlug,
  payload,
  relatedProducts,
}: MachineDetailPageProps) {
  const { detail, slugByLocale, sectionSlugByLocale } = payload;
  const hasLead = detail.images.length > 0;
  const primaryIdx = detail.images.findIndex((i) => i.isPrimary);
  const initialImageIndex = primaryIdx >= 0 ? primaryIdx : 0;
  const categoryName = detail.category?.name ?? "";
  const categoryCrumbLabel = categoryName.length > 0 ? categoryName : machinesMessages.breadcrumbMachines;

  return (
    <main className={`relative ${HOME_PAGE_BACKGROUND_CLASS} text-white ${MOBILE_BOTTOM_TAB_BAR_PAD}`}>
      <SiteHeader
        locale={locale}
        machineSectionSlugByLocale={sectionSlugByLocale}
        machineSlugByLocale={slugByLocale}
        messages={homeMessages}
        navContext="site"
      />
      <div className="overflow-x-hidden">
        <article className="pb-20">
          <section className={`mx-auto w-full max-w-[1680px] px-4 pb-6 sm:px-5 md:px-6 lg:px-8 xl:px-10 ${HERO_CONTENT_TOP_PAD}`}>
            <SiteBreadcrumb
              segments={[
                { label: homeMessages.nav.home, href: homePageHref(locale) },
                { label: homeMessages.nav.machines, href: machinesPageHref(locale) },
                { label: categoryCrumbLabel, href: machinesCategoryHref(locale, sectionSlug) },
                { label: detail.title },
              ]}
            />
          </section>

          {hasLead ? (
            <section className="mx-auto w-full max-w-[1680px] px-4 pb-12 sm:px-5 sm:pb-16 md:px-6 lg:px-8 xl:px-10">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-10 xl:gap-14">
                <MachineHeroGallery
                  fallbackAlt={machinesMessages.galleryFallbackAlt}
                  images={detail.images}
                  initialIndex={initialImageIndex}
                />
                <div className="flex min-w-0 flex-col gap-6 lg:max-w-none lg:pt-1">
                  <Link
                    className="inline-flex w-fit text-[11px] font-black uppercase tracking-[0.12em] text-[#ff6900] transition hover:brightness-110"
                    href={machinesCategoryHref(locale, sectionSlug)}
                  >
                    ← {machinesMessages.backToSection}
                  </Link>
                  <h1 className="font-display text-[clamp(1.35rem,4vw,2.25rem)] uppercase leading-[1.08] tracking-[-0.03em] text-white">
                    {detail.title}
                  </h1>
                  <div className="border-t border-[#18181b] pt-8">
                    <BlogProse html={detail.description} />
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="mx-auto max-w-[800px] px-4 pb-8 sm:px-5 md:px-6 lg:px-8 xl:px-10">
              <Link
                className="inline-flex text-[11px] font-black uppercase tracking-[0.12em] text-[#ff6900] transition hover:brightness-110"
                href={machinesCategoryHref(locale, sectionSlug)}
              >
                ← {machinesMessages.backToSection}
              </Link>
              <h1 className="mt-6 font-display text-[clamp(1.35rem,4vw,2.25rem)] uppercase leading-[1.08] tracking-[-0.03em] text-white">
                {detail.title}
              </h1>
              <div className="mt-10 border-t border-[#18181b] pt-10">
                <BlogProse html={detail.description} />
              </div>
            </section>
          )}

          {relatedProducts.length > 0 ? (
            <section className="mx-auto w-full max-w-[1680px] border-t border-[#18181b] px-4 pb-4 pt-12 sm:px-5 md:px-6 lg:px-8 xl:px-10">
              <h2 className="mb-8 font-display text-xl uppercase tracking-tight text-white sm:text-2xl">
                {machinesMessages.relatedTitle}
              </h2>
              <MachineRelatedCarousel
                items={relatedProducts}
                locale={locale}
                messages={machinesMessages}
                sectionSlug={sectionSlug}
              />
            </section>
          ) : null}
        </article>
        <Footer locale={locale} messages={homeMessages} />
      </div>
    </main>
  );
}
