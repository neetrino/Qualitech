import Image from "next/image";
import Link from "next/link";

import {
  advantageCardsLayout,
  articleCardsLayout,
  heroDemoMachineSlugsByLocale,
  homeAssets,
  solutionCardsLayout,
} from "@/features/home/home.data";
import {
  HERO_CONTENT_TOP_PAD,
  HOME_PAGE_BACKGROUND_CLASS,
  HeroBackgroundLayers,
  SOLUTIONS_TOP_FOLD_SCRIM_CLASS,
} from "@/features/home/home-hero-visual";
import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";
import { machineDetailHref, machinesCategoryHref, machinesPageHref } from "@/lib/i18n/locale-routes";
import { Footer } from "@/shared/layout/footer";
import { Header } from "@/shared/layout/header";

type HomePageProps = {
  readonly locale: HomeLocale;
  readonly messages: HomeMessages;
  /** First three top-level machine category slugs (same order as solution cards). */
  readonly machineSectionSlugs: readonly string[];
};

type SectionHeadingProps = {
  readonly eyebrow: string;
  readonly title: string;
  readonly accent: string;
  readonly description: string;
  readonly centered?: boolean;
};

function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div className={centered ? "mx-auto max-w-[680px] text-center" : "max-w-[680px]"}>
      <div className={`mb-4 flex items-center gap-2 ${centered ? "justify-center" : ""}`}>
        {!centered ? <span className="h-px w-10 rounded-full bg-[#ff6900]" /> : null}
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ff6900] sm:text-xs">{eyebrow}</p>
      </div>
      <h2 className="font-display text-[clamp(1.45rem,3.4vw,2.5rem)] uppercase leading-[1.05] tracking-[-0.04em] text-white">
        {title}
        {accent.length > 0 ? <span className="block text-[#ff6900]">{accent}</span> : null}
      </h2>
      {description.length > 0 ? (
        <p className={`mt-4 text-sm leading-6 text-[#9f9fa9] sm:leading-7 ${centered ? "mx-auto max-w-full" : "max-w-[540px]"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

const HERO_PRIMARY_CTA_CLASS =
  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#ff6900] px-5 text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-[0_8px_14px_rgba(255,105,0,0.28),0_3px_5px_rgba(255,105,0,0.25)] transition hover:brightness-110 sm:h-12 sm:text-xs sm:tracking-[0.14em] sm:w-auto sm:min-w-[200px] lg:min-w-[220px]";

const HERO_SECONDARY_CTA_CLASS =
  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-white px-4 pl-[18px] text-[11px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white/10 sm:h-12 sm:text-xs sm:tracking-[0.14em] sm:w-auto sm:min-w-[168px] lg:min-w-[180px]";

function HeroSection({ locale, messages }: { readonly locale: HomeLocale; readonly messages: HomeMessages }) {
  const demoSlugs = heroDemoMachineSlugsByLocale[locale];
  const demoHref = machineDetailHref(locale, demoSlugs.categorySlug, demoSlugs.machineSlug);
  const machinesHref = machinesPageHref(locale);
  /** Extra top spacing for RU hero copy — keeps CTAs visually balanced below longer lines. */
  const ctaRowMarginTop =
    locale === "ru" ? "mt-20 sm:mt-24 lg:mt-40" : "mt-8 sm:mt-10 lg:mt-24";

  return (
    <section className="relative min-h-[min(88svh,980px)] overflow-hidden lg:min-h-[920px]" id="hero">
      <HeroBackgroundLayers imagePriority />
      <div
        className={`relative z-[2] mx-auto flex w-full max-w-[1380px] flex-col px-4 pb-12 sm:px-5 sm:pb-16 md:px-6 lg:min-h-[920px] lg:px-8 lg:pb-16 xl:px-10 ${HERO_CONTENT_TOP_PAD}`}
      >
        <div className="relative mx-auto w-full max-w-[880px] text-center">
          <div className="pointer-events-none absolute left-1/2 top-0 w-full max-w-[920px] -translate-x-1/2 sm:top-[6px]">
            <div className="relative mx-auto aspect-[983/328] w-full max-w-[90vw] overflow-visible sm:max-w-none">
              <Image
                alt=""
                className="absolute left-1/2 top-1/2 w-[140%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-95 sm:w-[160%]"
                src={homeAssets.heroGlow}
                width={983}
                height={328}
              />
            </div>
          </div>
          <div className="relative flex flex-col items-center gap-2 pt-4 sm:gap-[10px] sm:pt-5">
            <p className="text-[11px] font-black uppercase leading-5 tracking-[-0.15px] text-white sm:text-xs">{messages.hero.eyebrow}</p>
            <p className="font-display text-center text-[clamp(0.95rem,3.2vw,1.9rem)] font-normal uppercase leading-tight tracking-[-0.06em] text-[#ff6900] lg:text-[32px] lg:leading-[1.15] lg:tracking-[-2px]">
              {messages.hero.lineOrange}
            </p>
            <h1 className="font-display text-center text-[clamp(1.35rem,6.2vw,3.75rem)] font-normal uppercase leading-[0.95] tracking-[0.02em] text-white lg:text-[60px] lg:leading-[1.05] lg:tracking-[4px]">
              {messages.hero.titleLine1}
            </h1>
            <h1 className="font-display text-center text-[clamp(1.35rem,6.2vw,3.75rem)] font-normal uppercase leading-[0.95] tracking-[-0.04em] text-white lg:text-[60px] lg:leading-[1.05] lg:tracking-[-2px]">
              {messages.hero.titleLine2}
            </h1>
          </div>
        </div>
        <div
          className={`flex w-full max-w-md flex-col items-stretch gap-2.5 self-center sm:max-w-none sm:flex-row sm:justify-center sm:gap-3 ${ctaRowMarginTop}`}
        >
          <Link className={HERO_PRIMARY_CTA_CLASS} href={machinesHref}>
            {messages.hero.ctaExplore}
            <Image alt="" src={homeAssets.primaryArrow} width={20} height={20} />
          </Link>
          <Link className={HERO_SECONDARY_CTA_CLASS} href={demoHref}>
            <Image alt="" className="shrink-0" src={homeAssets.playIcon} width={16} height={16} />
            {messages.hero.ctaDemo}
          </Link>
        </div>
        <div className="mt-10 grid gap-8 lg:mt-auto lg:grid-cols-[minmax(0,228px)_1fr_minmax(0,440px)] lg:items-end lg:gap-5 lg:pt-10 xl:grid-cols-[228px_1fr_440px]">
          <p className="max-w-[248px] text-xs font-normal leading-relaxed tracking-[-0.02em] text-white sm:text-sm sm:leading-6 sm:tracking-[-0.03em] lg:max-w-none xl:max-w-[228px]">
            {messages.hero.lede}
          </p>
          <div className="hidden lg:block" aria-hidden />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4 lg:max-w-[440px] lg:justify-self-end xl:gap-6">
            {messages.hero.stats.map((stat, statIndex) => (
              <div key={`${stat.value}-${stat.label}-${statIndex}`} className="relative border-l-[3px] border-[#ff6900] pl-3">
                <p className="text-2xl font-black leading-tight tracking-wide text-white sm:text-3xl sm:leading-none sm:tracking-[0.25px]">{stat.value}</p>
                <p className="mt-2 text-[11px] font-normal uppercase leading-4 tracking-[0.6px] text-white">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SolutionsSection({
  messages,
  locale,
  machineSectionSlugs,
}: {
  readonly messages: HomeMessages;
  readonly locale: HomeLocale;
  readonly machineSectionSlugs: readonly string[];
}) {
  return (
    <section
      className="mx-auto max-w-[1280px] px-4 pb-16 pt-12 sm:px-5 sm:pb-20 sm:pt-14 md:px-6 lg:px-8 xl:max-w-[1360px] xl:px-10"
      id="solutions"
    >
      <SectionHeading
        eyebrow={messages.solutions.eyebrow}
        title={messages.solutions.title}
        accent={messages.solutions.accent}
        description={messages.solutions.description}
      />
      <div className="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-3 xl:gap-16">
        {solutionCardsLayout.map((card, index) => {
          const content = messages.solutions.cards[index];
          const sectionSlug = machineSectionSlugs[index];
          const detailsHref = sectionSlug ? machinesCategoryHref(locale, sectionSlug) : machinesPageHref(locale);
          return (
            <article key={card.index} className="overflow-hidden rounded-xl border border-[#18181b] bg-[#09090b]">
              <div className="relative h-[188px] overflow-hidden sm:h-[208px] lg:h-[224px]">
                <Image alt={content.title} className="object-cover" fill sizes="(min-width: 1280px) 400px, 100vw" src={card.imageSrc} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[rgba(9,9,11,0.4)] to-transparent" />
                <span className={`absolute top-3 text-5xl font-black leading-none text-white sm:top-4 sm:text-6xl ${index === 0 ? "right-4" : index === 1 ? "right-5" : "right-6"}`}>{card.index}</span>
              </div>
              <div className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
                <div className="mb-5 h-0.5 w-[70%] rounded-full bg-[#ff6900]" />
                <h3 className="max-w-[320px] text-base font-black leading-snug text-white sm:text-lg">{content.title}</h3>
                <p className="mt-3 max-w-none text-xs leading-relaxed tracking-[-0.02em] text-[#71717b] sm:mt-4 sm:text-sm">{content.description}</p>
                <ul className="mt-6 space-y-2 sm:mt-7">
                  {content.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#52525c] sm:gap-2.5 sm:text-xs sm:tracking-[0.12em]">
                      <span className="size-1 rounded-full bg-[#ff6900]" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <Link className="mt-6 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#ff6900] sm:mt-7 sm:text-xs sm:tracking-[0.14em]" href={detailsHref}>
                  {messages.solutions.ctaDetails}
                  <Image alt="" src={index === 0 ? homeAssets.linkArrow : homeAssets.linkArrowAlt} width={20} height={20} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AboutSection({ messages }: { readonly messages: HomeMessages }) {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-16 sm:px-5 sm:pb-20 sm:pt-20 md:px-6 lg:px-8 xl:px-10" id="about">
      <div className="absolute left-0 top-[34%] hidden h-48 w-px rounded-full bg-[#ff6900] xl:block" />
      <div className="absolute -left-20 top-[4.75rem] hidden w-[min(560px,48vw)] sm:top-[-8.5rem] xl:block">
        <Image alt="" className="rotate-90 -scale-y-100 h-auto w-full" src={homeAssets.robotArm} width={680} height={724} />
      </div>
      <div className="absolute -right-20 -bottom-16 hidden w-[min(560px,48vw)] -translate-x-10 xl:block">
        <Image alt="" className="rotate-90 h-auto w-full" src={homeAssets.robotArm} width={680} height={724} />
      </div>
      <div className="mx-auto max-w-[680px] text-center">
        <SectionHeading
          eyebrow={messages.about.eyebrow}
          title={messages.about.title}
          accent={messages.about.accent}
          description={messages.about.description}
          centered
        />
        <div className="mt-6 space-y-4 text-sm leading-relaxed tracking-[-0.02em] text-[#9f9fa9] sm:text-[15px]">
          {messages.about.paragraphs.map((paragraph, paragraphIndex) => (
            <p key={`${paragraphIndex}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-2">
          {messages.about.highlights.map((highlight, highlightIndex) => (
            <div key={`${highlight.value}-${highlightIndex}`} className="rounded-xl border border-[#27272a] bg-[#18181b] px-5 py-5 text-left sm:px-6 sm:py-6">
              <div className="mb-5 -mt-5 h-0.5 w-[70%] rounded-full bg-[#ff6900] sm:-mt-6" />
              <p className="text-2xl font-black text-white sm:text-3xl">{highlight.value}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[#52525c] sm:text-[11px] sm:tracking-[0.16em]">{highlight.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AdvantagesSection({ messages }: { readonly messages: HomeMessages }) {
  return (
    <section className="relative px-4 pb-16 pt-14 sm:px-5 sm:pb-20 sm:pt-16 md:px-6 lg:px-8 xl:px-10">
      <div className="absolute left-1/2 top-20 hidden h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[linear-gradient(28.86deg,rgba(243,244,246,0.2)_0%,rgba(0,0,0,0)_100%)] blur-[48px] xl:block" />
      <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-[180px] bg-[rgba(255,105,0,0.08)] xl:block" />
      <div className="relative mx-auto max-w-[1120px] xl:max-w-[1200px]">
        <SectionHeading
          eyebrow={messages.advantages.eyebrow}
          title={messages.advantages.title}
          accent={messages.advantages.accent}
          description={messages.advantages.description}
          centered
        />
        <div className="mt-12 grid gap-4 pt-5 sm:grid-cols-2 sm:gap-5 sm:pt-6 lg:mt-14 xl:mx-auto xl:max-w-[1020px] xl:grid-cols-4 xl:gap-6">
          {advantageCardsLayout.map((card, index) => {
            const content = messages.advantages.cards[index];
            return (
              <article key={card.index} className="relative overflow-visible">
                <div className="relative min-h-[228px] overflow-hidden rounded-lg border border-[#18181b] bg-[#09090b] px-4 pb-5 pt-11 sm:min-h-[248px] sm:px-5 sm:pb-6 sm:pt-12">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-1.5 right-2 z-0 select-none text-right font-black leading-[0.78] tracking-[-0.06em] text-[rgba(255,255,255,0.08)] text-[clamp(3.1rem,10.5vw,5.25rem)] sm:bottom-2 sm:right-3"
                  >
                    {card.index}
                  </span>
                  <div className="relative z-10">
                    <h3 className="text-center text-xs font-black uppercase leading-snug tracking-[0.02em] text-white sm:text-sm">{content.title}</h3>
                    <p className="mt-3 text-center text-[10px] leading-relaxed tracking-[-0.01em] text-[#71717b] sm:mt-3.5 sm:text-[11px]">{content.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 top-0 z-20 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[11px] bg-[#ff6900] shadow-[0_6px_20px_rgba(255,105,0,0.27)] sm:size-12 sm:rounded-xl">
                  <Image alt="" className="size-6 sm:size-7" src={card.iconSrc} width={28} height={28} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function InsightsSection({ messages }: { readonly messages: HomeMessages }) {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-5 sm:pb-20 sm:pt-16 md:px-6 lg:px-8 xl:px-10" id="insights">
      <div className="absolute right-[8%] top-12 hidden h-[520px] w-[900px] rounded-full bg-[linear-gradient(28.86deg,rgba(243,244,246,0.2)_0%,rgba(0,0,0,0)_100%)] blur-[48px] xl:block" />
      <div className="mx-auto max-w-[1280px] xl:max-w-[1360px]">
        <SectionHeading
          eyebrow={messages.insights.eyebrow}
          title={messages.insights.title}
          accent={messages.insights.accent}
          description={messages.insights.description}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:mt-12 xl:grid-cols-4 xl:gap-8">
          {articleCardsLayout.map((article, articleIndex) => {
            const content = messages.insights.articles[articleIndex];
            return (
              <article key={`${article.imageSrc}-${articleIndex}`} className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[#18181b] bg-black p-px">
                <div className="relative h-[172px] shrink-0 overflow-hidden rounded-t-[12px] bg-[#18181b] sm:h-[190px] lg:h-[200px]">
                  <Image alt={content.title} className="object-cover" fill sizes="(min-width: 1280px) 320px, 100vw" src={article.imageSrc} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-[rgba(0,0,0,0.4)] to-transparent" />
                  <span className="absolute left-3 top-3 rounded-lg bg-[#ff6900] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-black sm:left-4 sm:top-4 sm:px-3 sm:text-[10px] sm:tracking-[0.14em]">{content.category}</span>
                </div>
                <div className="flex min-h-[212px] flex-1 flex-col px-4 py-4 sm:min-h-[232px] sm:px-5 sm:py-5 xl:min-h-[252px]">
                  <div className="flex flex-wrap items-center gap-3 text-[9px] uppercase tracking-[0.12em] text-[#52525c] sm:gap-4 sm:text-[11px] sm:tracking-[0.14em]">
                    <span className="flex items-center gap-1.5"><Image alt="" src={article.dateIconSrc} width={14} height={14} />{content.date}</span>
                    <span className="flex items-center gap-1.5"><Image alt="" src={article.timeIconSrc} width={14} height={14} />{content.readTime}</span>
                  </div>
                  <h3 className="mt-3 text-sm font-bold leading-snug tracking-[-0.02em] text-white sm:mt-4 sm:text-base">{content.title}</h3>
                  <p className="mt-3 min-h-0 flex-1 text-xs leading-relaxed tracking-[-0.02em] text-[#71717b] sm:mt-4 sm:text-sm">{content.description}</p>
                  <Link className="mt-4 inline-flex shrink-0 items-center gap-1 self-start text-[11px] font-bold uppercase tracking-[0.12em] text-[#ff6900] sm:mt-5 sm:text-xs sm:tracking-[0.14em]" href="#footer">
                    {messages.insights.readMore}
                    <Image alt="" src={article.arrowIconSrc} width={18} height={18} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-10 flex justify-center sm:mt-12">
          <button className="flex h-11 items-center gap-2 rounded-full bg-[#ff6900] px-8 text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-[0_8px_24px_rgba(255,105,0,0.3)] sm:h-12 sm:gap-3 sm:px-9 sm:text-xs sm:tracking-[0.14em]" type="button">
            {messages.insights.ctaMore}
            <Image alt="" src={homeAssets.primaryArrow} width={20} height={20} />
          </button>
        </div>
      </div>
    </section>
  );
}

export function HomePage({ locale, machineSectionSlugs, messages }: HomePageProps) {
  return (
    <main className={`relative ${HOME_PAGE_BACKGROUND_CLASS} text-white`}>
      <Header locale={locale} messages={messages} navContext="home" />
      <div className="overflow-x-hidden">
        <HeroSection locale={locale} messages={messages} />
        <SolutionsSection locale={locale} machineSectionSlugs={machineSectionSlugs} messages={messages} />
        <AboutSection messages={messages} />
        <AdvantagesSection messages={messages} />
        <InsightsSection messages={messages} />
        <Footer locale={locale} messages={messages} />
      </div>
    </main>
  );
}
