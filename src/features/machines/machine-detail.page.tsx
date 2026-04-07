import Image from "next/image";
import Link from "next/link";

import { BlogProse } from "@/features/blog/blog-prose";
import type { MachineDetailWithLocaleSlugs, MachineListItemDto } from "@/features/machines/machines.dto";
import { MachineRelatedCarousel } from "@/features/machines/machine-related-carousel";
import type { MachinesMessages } from "@/features/machines/machines.messages";
import { HERO_CONTENT_TOP_PAD } from "@/features/home/home-hero-visual";
import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";
import { isRemoteImageUrl } from "@/lib/image/remote-image-url";
import { homePageHref, machinesCategoryHref, machinesPageHref } from "@/lib/i18n/locale-routes";
import { Footer } from "@/shared/layout/footer";
import { Header } from "@/shared/layout/header";
import { SiteBreadcrumb } from "@/shared/layout/site-breadcrumb";

type MachineDetailPageProps = {
  readonly locale: HomeLocale;
  readonly homeMessages: HomeMessages;
  readonly machinesMessages: MachinesMessages;
  readonly sectionSlug: string;
  readonly payload: MachineDetailWithLocaleSlugs;
  readonly relatedProducts: MachineListItemDto[];
};

function ProductGalleryGrid({
  images,
  fallbackAlt,
}: {
  readonly images: { url: string; alt: string | null; sortOrder: number; isPrimary: boolean }[];
  readonly fallbackAlt: string;
}) {
  if (images.length === 0) {
    return null;
  }
  return (
    <div className="mx-auto grid w-full max-w-[1680px] gap-5 px-4 sm:grid-cols-2 sm:gap-6 sm:px-5 md:px-6 lg:gap-8 lg:px-8 xl:px-10">
      {images.map((img, index) => {
        const alt = img.alt?.trim() || fallbackAlt;
        const src = img.url.trim();
        return (
          <div
            key={`${img.url}-${img.sortOrder}-${String(img.isPrimary)}`}
            className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[#18181b] bg-[#09090b]"
          >
            <Image
              alt={alt}
              className="object-cover object-center"
              fill
              priority={index === 0}
              sizes="(max-width: 640px) 100vw, 50vw"
              src={src}
              unoptimized={isRemoteImageUrl(src)}
            />
          </div>
        );
      })}
    </div>
  );
}

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
  const heroIndex = hasLead ? (primaryIdx >= 0 ? primaryIdx : 0) : -1;
  const heroImage = heroIndex >= 0 ? detail.images[heroIndex]! : null;
  const heroSrc = heroImage ? heroImage.url.trim() : "";
  const restImages = hasLead ? detail.images.filter((_, i) => i !== heroIndex) : [];
  const categoryName = detail.category?.name ?? "";
  const categoryCrumbLabel = categoryName.length > 0 ? categoryName : machinesMessages.breadcrumbMachines;

  return (
    <main className="relative bg-[linear-gradient(201deg,#252525_14.56%,#000_90.79%)] text-white">
      <Header
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

          {heroImage && heroSrc.length > 0 ? (
            <section className="mx-auto w-full max-w-[1680px] px-4 pb-12 sm:px-5 sm:pb-16 md:px-6 lg:px-8 xl:px-10">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-10 xl:gap-14">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[#18181b] bg-[#09090b] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)] lg:sticky lg:top-28 lg:aspect-auto lg:min-h-[min(70vh,720px)] lg:max-h-[calc(100vh-6rem)]">
                  <Image
                    alt={heroImage.alt?.trim() || machinesMessages.galleryFallbackAlt}
                    className="object-cover object-center"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    src={heroSrc}
                    unoptimized={isRemoteImageUrl(heroSrc)}
                  />
                </div>
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

          {restImages.length > 0 ? (
            <section className="w-full pb-16 pt-4 sm:pb-20 sm:pt-6">
              <ProductGalleryGrid fallbackAlt={machinesMessages.galleryFallbackAlt} images={restImages} />
            </section>
          ) : null}

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
        <Footer messages={homeMessages} />
      </div>
    </main>
  );
}
