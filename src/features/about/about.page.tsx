import Image from "next/image";
import Link from "next/link";

import { aboutAssets } from "@/features/about/about.data";
import type { AboutMessages } from "@/features/about/about.messages";
import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";
import { HERO_CONTENT_TOP_PAD, HOME_PAGE_BACKGROUND_CLASS } from "@/features/home/home-hero-visual";
import { contactPageHref, homePageHref } from "@/lib/i18n/locale-routes";
import { Footer } from "@/shared/layout/footer";
import { MOBILE_BOTTOM_TAB_BAR_PAD } from "@/shared/layout/mobile-tab-bar.constants";
import { SiteHeader } from "@/shared/layout/site-header";
import { SiteBreadcrumb } from "@/shared/layout/site-breadcrumb";

type AboutPageProps = {
  readonly locale: HomeLocale;
  readonly homeMessages: HomeMessages;
  readonly aboutMessages: AboutMessages;
};

function AboutStory({ locale, homeMessages, messages }: { readonly locale: HomeLocale; readonly homeMessages: HomeMessages; readonly messages: AboutMessages }) {
  return (
    <section
      className={`mx-auto max-w-[1280px] px-4 pb-14 sm:px-5 md:px-6 lg:px-8 xl:max-w-[1360px] xl:px-10 ${HERO_CONTENT_TOP_PAD}`}
    >
      <SiteBreadcrumb
        segments={[
          { label: homeMessages.nav.home, href: homePageHref(locale) },
          { label: homeMessages.nav.about },
        ]}
      />
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <h2 className="font-display text-[clamp(1.45rem,3.4vw,2.5rem)] uppercase leading-[1.05] tracking-[-0.04em] text-white">
            {messages.storyTitle}
            {messages.storyTitleAccent.length > 0 ? (
              <span className="block text-[#ff6900]">{messages.storyTitleAccent}</span>
            ) : null}
          </h2>
          {messages.storyLead.length > 0 ? (
            <p className="mt-4 text-sm font-semibold leading-7 text-white/90 sm:text-[15px] sm:leading-8">{messages.storyLead}</p>
          ) : null}
          <div className="mt-5 space-y-4 text-sm leading-7 text-[#9f9fa9] sm:text-[15px] sm:leading-8">
            {messages.storyParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-[#18181b] bg-[#09090b]">
          <Image
            alt={messages.storyImageAlt}
            className="aspect-[4/3] w-full object-cover"
            height={900}
            src={aboutAssets.storyImage}
            width={1200}
            sizes="(min-width: 1024px) 42vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}

function AboutValues({ messages }: { readonly messages: AboutMessages }) {
  return (
    <section className="border-y border-[#18181b] bg-[#09090b]/60">
      <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-5 md:px-6 lg:px-8 xl:max-w-[1360px] xl:px-10">
        <h2 className="text-sm font-black uppercase tracking-[0.08em] text-white sm:text-base">{messages.valuesTitle}</h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {messages.values.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-[#27272a] bg-[linear-gradient(145deg,#141414_0%,#0a0a0a_100%)] p-6 sm:p-7"
            >
              <p className="text-sm font-bold uppercase tracking-[0.06em] text-[#ff6900]">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-[#9f9fa9] sm:text-[15px]">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function AboutStats({ messages }: { readonly messages: AboutMessages }) {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-14 sm:px-5 md:px-6 lg:px-8 xl:max-w-[1360px] xl:px-10">
      <h2 className="text-center text-sm font-black uppercase tracking-[0.08em] text-white sm:text-base">{messages.statsTitle}</h2>
      <ul className="mt-10 grid max-w-3xl gap-6 sm:grid-cols-2 sm:justify-items-stretch lg:mx-auto">
        {messages.stats.map((stat) => (
          <li
            key={stat.label}
            className="rounded-2xl border border-[#18181b] bg-[#09090b] px-5 py-6 text-center sm:px-6 sm:py-8"
          >
            <p className="font-display text-2xl uppercase tracking-[-0.03em] text-white sm:text-3xl">{stat.value}</p>
            <p className="mt-2 text-xs leading-5 text-[#9f9fa9] sm:text-sm">{stat.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AboutGallery({ messages }: { readonly messages: AboutMessages }) {
  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-14 sm:px-5 md:px-6 lg:px-8 xl:max-w-[1360px] xl:px-10">
      <h2 className="text-sm font-black uppercase tracking-[0.08em] text-white sm:text-base">{messages.galleryTitle}</h2>
      <ul className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5">
        {aboutAssets.gallery.map((src, index) => {
          const alt = messages.galleryAlts[index] ?? "";
          return (
            <li key={src} className="overflow-hidden rounded-xl border border-[#18181b]">
              <Image alt={alt} className="aspect-[4/3] w-full object-cover" height={600} src={src} width={800} sizes="(min-width: 640px) 33vw, 100vw" />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function AboutCta({ locale, messages }: { readonly locale: HomeLocale; readonly messages: AboutMessages }) {
  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-20 sm:px-5 md:px-6 lg:px-8 xl:max-w-[1360px] xl:px-10">
      <div className="rounded-2xl border border-[#ff6900]/35 bg-[linear-gradient(120deg,#1a0f08_0%,#0a0a0a_55%)] px-6 py-10 sm:px-10 sm:py-12">
        <h2 className="max-w-xl font-display text-xl uppercase leading-tight tracking-[-0.03em] text-white sm:text-2xl">{messages.ctaTitle}</h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[#9f9fa9] sm:text-[15px]">{messages.ctaBody}</p>
        <Link
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[#ff6900] px-8 py-3 text-xs font-black uppercase tracking-[0.12em] text-black transition hover:brightness-110 sm:text-[11px]"
          href={contactPageHref(locale)}
        >
          {messages.ctaButton}
        </Link>
      </div>
    </section>
  );
}

export function AboutPage({ locale, homeMessages, aboutMessages }: AboutPageProps) {
  return (
    <main className={`relative ${HOME_PAGE_BACKGROUND_CLASS} text-white ${MOBILE_BOTTOM_TAB_BAR_PAD}`}>
      <SiteHeader locale={locale} messages={homeMessages} navContext="site" />
      <div className="overflow-x-hidden">
        <AboutStory homeMessages={homeMessages} locale={locale} messages={aboutMessages} />
        <AboutValues messages={aboutMessages} />
        <AboutStats messages={aboutMessages} />
        <AboutCta locale={locale} messages={aboutMessages} />
        <Footer locale={locale} messages={homeMessages} />
      </div>
    </main>
  );
}

