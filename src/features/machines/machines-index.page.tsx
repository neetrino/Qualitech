import { homeAssets } from "@/features/home/home.data";
import { HERO_CONTENT_TOP_PAD, HOME_PAGE_BACKGROUND_CLASS } from "@/features/home/home-hero-visual";
import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";
import type { MachineCategoryCardDto } from "@/features/machines/machines.dto";
import {
  MachineCategorySolutionCard,
  solutionCardOverlayPositionClass,
} from "@/features/machines/machine-category-solution-card";
import type { MachinesMessages } from "@/features/machines/machines.messages";
import { homePageHref, machinesCategoryHref } from "@/lib/i18n/locale-routes";
import { Footer } from "@/shared/layout/footer";
import { MOBILE_BOTTOM_TAB_BAR_PAD } from "@/shared/layout/mobile-tab-bar.constants";
import { SiteHeader } from "@/shared/layout/site-header";
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
  index,
}: {
  readonly locale: HomeLocale;
  readonly messages: MachinesMessages;
  readonly category: MachineCategoryCardDto;
  readonly index: number;
}) {
  const href = machinesCategoryHref(locale, category.slug);
  const imageAlt = category.coverImage?.alt?.trim() || messages.cardFallbackAlt;
  const imageSrc = category.coverImage?.url?.trim() ?? "";
  const description = category.homeDescription?.trim() ?? "";
  const overlayIndex = String(index + 1).padStart(2, "0");
  const ctaArrowSrc = index === 0 ? homeAssets.linkArrow : homeAssets.linkArrowAlt;

  return (
    <MachineCategorySolutionCard
      bullets={category.homeBullets}
      ctaArrowSrc={ctaArrowSrc}
      ctaLabel={messages.readDetails}
      description={description}
      href={href}
      imageAlt={imageAlt}
      imageSrc={imageSrc}
      overlayIndex={overlayIndex}
      overlayNumberPositionClassName={solutionCardOverlayPositionClass(index)}
      title={category.name}
    />
  );
}

export function MachinesIndexPage({ locale, homeMessages, machinesMessages, categories }: MachinesIndexPageProps) {
  return (
    <main className={`relative ${HOME_PAGE_BACKGROUND_CLASS} text-white ${MOBILE_BOTTOM_TAB_BAR_PAD}`}>
      <SiteHeader locale={locale} messages={homeMessages} navContext="site" />
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
              {categories.map((c, index) => (
                <CategoryCard
                  key={c.slug}
                  category={c}
                  index={index}
                  locale={locale}
                  messages={machinesMessages}
                />
              ))}
            </div>
          )}
        </section>

        <Footer locale={locale} messages={homeMessages} />
      </div>
    </main>
  );
}
