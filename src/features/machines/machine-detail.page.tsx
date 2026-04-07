import Image from "next/image";
import Link from "next/link";

import { BLOG_DETAIL_HERO_OVERLAY_MIN_HEIGHT_CLASSNAME } from "@/features/blog/blog.constants";
import { BlogProse } from "@/features/blog/blog-prose";
import type { MachineDetailWithLocaleSlugs } from "@/features/machines/machines.dto";
import type { MachinesMessages } from "@/features/machines/machines.messages";
import { HERO_CONTENT_TOP_PAD } from "@/features/home/home-hero-visual";
import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";
import { isRemoteImageUrl } from "@/lib/image/remote-image-url";
import { contactPageHref, machinesCategoryHref, machinesPageHref } from "@/lib/i18n/locale-routes";
import { Footer } from "@/shared/layout/footer";
import { Header } from "@/shared/layout/header";

type MachineDetailPageProps = {
  readonly locale: HomeLocale;
  readonly homeMessages: HomeMessages;
  readonly machinesMessages: MachinesMessages;
  readonly sectionSlug: string;
  readonly payload: MachineDetailWithLocaleSlugs;
};

function ProductGalleryGrid({
  images,
  fallbackAlt,
}: {
  readonly images: { url: string; alt: string | null; sortOrder: number }[];
  readonly fallbackAlt: string;
}) {
  if (images.length === 0) {
    return null;
  }
  return (
    <div className="mx-auto grid w-full max-w-[1200px] gap-5 px-4 sm:grid-cols-2 sm:gap-6 sm:px-5 md:px-6 lg:gap-8 lg:px-8 xl:px-10">
      {images.map((img, index) => {
        const alt = img.alt?.trim() || fallbackAlt;
        const src = img.url.trim();
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
              src={src}
              unoptimized={isRemoteImageUrl(src)}
            />
          </div>
        );
      })}
    </div>
  );
}

export function MachineDetailPage({ locale, homeMessages, machinesMessages, sectionSlug, payload }: MachineDetailPageProps) {
  const { detail, slugByLocale, sectionSlugByLocale } = payload;
  const hasLead = detail.images.length > 0;
  const heroImage = hasLead ? detail.images[0]! : null;
  const heroSrc = heroImage ? heroImage.url.trim() : "";
  const restImages = hasLead && detail.images.length > 1 ? detail.images.slice(1) : [];
  const categoryName = detail.category?.name ?? "";

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
        <article>
          <section className={`mx-auto w-full max-w-[1200px] px-4 pb-6 sm:px-5 md:px-6 lg:px-8 xl:px-10 ${HERO_CONTENT_TOP_PAD}`}>
            <nav aria-label="Breadcrumb" className="mb-6 text-[11px] font-medium uppercase tracking-[0.12em] text-[#71717b]">
              <Link className="text-[#ff6900] transition hover:brightness-110" href={machinesPageHref(locale)}>
                {machinesMessages.breadcrumbMachines}
              </Link>
              <span className="mx-2 text-[#3f3f46]" aria-hidden>
                /
              </span>
              <Link className="text-[#ff6900] transition hover:brightness-110" href={machinesCategoryHref(locale, sectionSlug)}>
                {categoryName.length > 0 ? categoryName : machinesMessages.breadcrumbMachines}
              </Link>
              <span className="mx-2 text-[#3f3f46]" aria-hidden>
                /
              </span>
              <span className="text-[#d4d4d8]">{detail.title}</span>
            </nav>
          </section>

          {heroImage && heroSrc.length > 0 ? (
            <section className="mx-auto w-full max-w-[1200px] px-4 pb-12 sm:px-5 sm:pb-16 md:px-6 lg:px-8 xl:px-10">
              <div className="relative w-full overflow-hidden rounded-2xl border border-[#18181b] bg-[#09090b] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)]">
                <div className="absolute inset-0">
                  <Image
                    alt={heroImage.alt?.trim() || machinesMessages.galleryFallbackAlt}
                    className="object-cover object-center"
                    fill
                    priority
                    sizes="(max-width: 1280px) 100vw, 1200px"
                    src={heroSrc}
                    unoptimized={isRemoteImageUrl(heroSrc)}
                  />
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.72)_22%,rgba(0,0,0,0.88)_55%,rgb(0_0_0)_100%)]"
                />
                <div
                  className={`relative z-[1] space-y-4 p-6 sm:p-8 md:p-10 ${BLOG_DETAIL_HERO_OVERLAY_MIN_HEIGHT_CLASSNAME} pb-10 sm:pb-12`}
                >
                  <Link
                    className="inline-flex w-fit text-[11px] font-black uppercase tracking-[0.12em] text-[#ff6900] transition hover:brightness-110"
                    href={machinesCategoryHref(locale, sectionSlug)}
                  >
                    ← {machinesMessages.backToSection}
                  </Link>
                  <h1 className="max-w-[48rem] font-display text-[clamp(1.35rem,4vw,2.25rem)] uppercase leading-[1.08] tracking-[-0.03em] text-white">
                    {detail.title}
                  </h1>
                  {detail.shortDescription.length > 0 ? (
                    <p className="max-w-[40rem] text-base leading-relaxed text-[#e4e4e7] sm:text-[17px]">{detail.shortDescription}</p>
                  ) : null}
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
              {detail.shortDescription.length > 0 ? (
                <p className="mt-4 text-base leading-relaxed text-[#9f9fa9] sm:text-[17px]">{detail.shortDescription}</p>
              ) : null}
            </section>
          )}

          <section className="mx-auto max-w-[800px] px-4 pb-12 sm:px-5 sm:pb-16 md:px-6 lg:px-8 xl:px-10">
            <div className="border-t border-[#18181b] pt-10">
              <BlogProse html={detail.body} />
            </div>
          </section>

          {restImages.length > 0 ? (
            <section className="w-full pb-16 pt-4 sm:pb-20 sm:pt-6">
              <ProductGalleryGrid fallbackAlt={machinesMessages.galleryFallbackAlt} images={restImages} />
            </section>
          ) : null}

          <section className="mx-auto max-w-[800px] px-4 pb-20 sm:px-5 md:px-6 lg:px-8 xl:px-10">
            <div className="flex justify-center rounded-2xl border border-[#27272a] bg-[#09090b] px-6 py-8 sm:px-8">
              <Link
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#ff6900] px-8 text-[11px] font-black uppercase tracking-[0.12em] text-black transition hover:brightness-110 sm:h-12 sm:px-9 sm:text-xs"
                href={contactPageHref(locale)}
              >
                {machinesMessages.ctaContact}
              </Link>
            </div>
          </section>
        </article>
        <Footer messages={homeMessages} />
      </div>
    </main>
  );
}
