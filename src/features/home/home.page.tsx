import Image from "next/image";
import Link from "next/link";

import {
  aboutHighlights,
  aboutParagraphs,
  advantageCards,
  articleCards,
  footerSections,
  heroStats,
  homeAssets,
  legalLinks,
  navItems,
  solutionCards,
} from "@/features/home/home.data";

const CONTACT_INFO_ICON_SIZE_PX = 14;

/** Dark fade from hero image into lower content (matches common reference layouts). */
const HERO_BOTTOM_SCRIM_CLASS =
  "pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[min(50vh,520px)] bg-[linear-gradient(to_top,rgb(0_0_0)_0%,rgba(0,0,0,0.88)_16%,rgba(0,0,0,0.48)_48%,rgba(0,0,0,0)_100%)] sm:h-[min(48vh,560px)] lg:h-[min(42vh,600px)]";

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
        <span className="block text-[#ff6900]">{accent}</span>
      </h2>
      <p className={`mt-4 text-sm leading-6 text-[#9f9fa9] sm:leading-7 ${centered ? "mx-auto max-w-full" : "max-w-[540px]"}`}>
        {description}
      </p>
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-3 z-30 flex justify-center px-4 sm:top-5 sm:px-5 md:px-6 lg:top-12 lg:px-8 xl:px-10">
      <div className="relative flex w-full max-w-[1120px] flex-col gap-3 rounded-[20px] bg-white p-3 text-black shadow-[0_16px_48px_rgba(0,0,0,0.28)] sm:rounded-3xl sm:p-4 lg:h-[64px] lg:flex-row lg:items-center lg:justify-between lg:rounded-[80px] lg:px-6 lg:py-0 xl:max-w-[1220px]">
        <div className="flex items-center justify-between gap-2 lg:contents">
          <Link className="shrink-0" href="#hero">
            <Image alt="Qualitech logo" className="h-auto w-[76px] sm:w-[88px] lg:w-[100px]" src={homeAssets.headerLogo} width={118} height={53} priority />
          </Link>
          <div className="flex shrink-0 items-center gap-2 sm:gap-[17px] lg:order-3">
            <button
              className="flex h-9 min-w-0 flex-1 items-center justify-center rounded-full bg-[#ff6900] px-2 text-[9px] font-black uppercase tracking-[0.1em] text-black transition hover:brightness-110 sm:h-10 sm:max-w-[158px] sm:flex-none sm:px-3 sm:text-[11px] sm:tracking-[0.12em]"
              type="button"
            >
              ОСТАВИТЬ ЗАЯВКУ
            </button>
            <button className="relative flex h-9 w-[88px] shrink-0 items-center rounded-3xl bg-black text-white sm:h-10 sm:w-[100px]" type="button">
              <span className="absolute left-1 top-1/2 size-7 -translate-y-1/2 sm:left-[6px] sm:size-8">
                <Image alt="" src={homeAssets.languageIcon} width={32} height={32} />
                <Image alt="" className="pointer-events-none absolute inset-0 m-auto" src={homeAssets.languageAccent} width={7} height={11} />
              </span>
              <span className="absolute left-10 top-1/2 -translate-y-1/2 text-xs font-semibold leading-[15.6px] sm:left-[46px] sm:text-sm">РУС</span>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 sm:right-3">
                <Image alt="" className="rotate-90" src={homeAssets.languageArrow} width={1} height={15} />
              </span>
            </button>
          </div>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px] tracking-[-0.02em] sm:gap-x-6 sm:text-xs lg:absolute lg:left-1/2 lg:top-1/2 lg:w-auto lg:-translate-x-1/2 lg:-translate-y-1/2 lg:justify-center lg:gap-10 lg:text-sm">
          {navItems.map((item) => (
            <Link key={item.label} className="whitespace-nowrap transition hover:text-[#ff6900]" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[min(88svh,980px)] overflow-hidden lg:min-h-[920px]" id="hero">
      <div className="pointer-events-none absolute inset-0 w-full">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            alt=""
            className="absolute inset-0 h-full w-full max-w-none object-cover object-[50%_62%] brightness-[1.12] contrast-[0.98] sm:object-[50%_58%] lg:object-[50%_55%]"
            fill
            priority
            sizes="100vw"
            src={homeAssets.heroBackdrop}
          />
        </div>
      </div>
      <div aria-hidden className={HERO_BOTTOM_SCRIM_CLASS} />
      <div className="relative z-[2] mx-auto flex w-full max-w-[1380px] flex-col px-4 pb-12 pt-[108px] sm:px-5 sm:pb-16 sm:pt-[124px] md:px-6 md:pt-[140px] lg:min-h-[920px] lg:px-8 lg:pb-16 lg:pt-[200px] xl:px-10">
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
            <p className="text-[11px] font-black uppercase leading-5 tracking-[-0.15px] text-white sm:text-xs">Промышленное совершенство</p>
            <p className="font-display text-center text-[clamp(0.95rem,3.2vw,1.9rem)] font-normal uppercase leading-tight tracking-[-0.06em] text-[#ff6900] lg:text-[32px] lg:leading-[1.15] lg:tracking-[-2px]">
              Точные и надежные
            </p>
            <h1 className="font-display text-center text-[clamp(1.35rem,6.2vw,3.75rem)] font-normal uppercase leading-[0.95] tracking-[0.02em] text-white lg:text-[60px] lg:leading-[1.05] lg:tracking-[4px]">
              Промышленные
            </h1>
            <h1 className="font-display text-center text-[clamp(1.35rem,6.2vw,3.75rem)] font-normal uppercase leading-[0.95] tracking-[-0.04em] text-white lg:text-[60px] lg:leading-[1.05] lg:tracking-[-2px]">
              станки
            </h1>
          </div>
        </div>
        <div className="mt-8 flex w-full max-w-md flex-col items-stretch gap-2.5 self-center sm:mt-10 sm:max-w-none sm:flex-row sm:justify-center sm:gap-3 lg:mt-24">
          <button
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#ff6900] px-5 text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-[0_8px_14px_rgba(255,105,0,0.28),0_3px_5px_rgba(255,105,0,0.25)] sm:h-12 sm:text-xs sm:tracking-[0.14em] sm:w-auto sm:min-w-[200px] lg:min-w-[220px]"
            type="button"
          >
            Изучить станки
            <Image alt="" src={homeAssets.primaryArrow} width={20} height={20} />
          </button>
          <button
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-white px-4 pl-[18px] text-[11px] font-bold uppercase tracking-[0.12em] text-white sm:h-12 sm:text-xs sm:tracking-[0.14em] sm:w-auto sm:min-w-[168px] lg:min-w-[180px]"
            type="button"
          >
            <Image alt="" className="shrink-0" src={homeAssets.playIcon} width={16} height={16} />
            смотреть демо
          </button>
        </div>
        <div className="mt-10 grid gap-8 lg:mt-auto lg:grid-cols-[minmax(0,228px)_1fr_minmax(0,440px)] lg:items-end lg:gap-5 lg:pt-10 xl:grid-cols-[228px_1fr_440px]">
          <p className="max-w-[248px] text-xs font-normal leading-relaxed tracking-[-0.02em] text-white sm:text-sm sm:leading-6 sm:tracking-[-0.03em] lg:max-w-none xl:max-w-[228px]">
            Передовые промышленные решения, разработанные для максимальной производительности. Мы обеспечиваем надежность, точность и
            инновации..
          </p>
          <div className="hidden lg:block" aria-hidden />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4 lg:max-w-[440px] lg:justify-self-end xl:gap-6">
            {heroStats.map((stat) => (
              <div key={stat.value} className="relative border-l-[3px] border-[#ff6900] pl-3">
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

function SolutionsSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-16 pt-12 sm:px-5 sm:pb-20 sm:pt-14 md:px-6 lg:px-8 xl:max-w-[1360px] xl:px-10" id="solutions">
      <SectionHeading eyebrow="технология" title="ОСНОВНЫЕ РЕШЕНИЯ" accent="" description="Создан для производительности. Создан для надежности. Создано для будущего производства." />
      <div className="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-3 xl:gap-16">
        {solutionCards.map((card, index) => (
          <article key={card.index} className="overflow-hidden rounded-xl border border-[#18181b] bg-[#09090b]">
            <div className="relative h-[188px] overflow-hidden sm:h-[208px] lg:h-[224px]">
              <Image alt={card.title} className="object-cover" fill sizes="(min-width: 1280px) 400px, 100vw" src={card.imageSrc} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[rgba(9,9,11,0.4)] to-transparent" />
              <span className={`absolute top-3 text-5xl font-black leading-none text-white sm:top-4 sm:text-6xl ${index === 0 ? "right-4" : index === 1 ? "right-5" : "right-6"}`}>{card.index}</span>
            </div>
            <div className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
              <div className="mb-5 h-0.5 w-[70%] rounded-full bg-[#ff6900]" />
              <h3 className="max-w-[320px] text-base font-black leading-snug text-white sm:text-lg">{card.title}</h3>
              <p className="mt-3 max-w-none text-xs leading-relaxed tracking-[-0.02em] text-[#71717b] sm:mt-4 sm:text-sm">{card.description}</p>
              <ul className="mt-6 space-y-2 sm:mt-7">
                {card.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#52525c] sm:gap-2.5 sm:text-xs sm:tracking-[0.12em]">
                    <span className="size-1 rounded-full bg-[#ff6900]" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <Link className="mt-6 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#ff6900] sm:mt-7 sm:text-xs sm:tracking-[0.14em]" href="#footer">
                смотреть детали
                <Image alt="" src={index === 0 ? homeAssets.linkArrow : homeAssets.linkArrowAlt} width={20} height={20} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AboutSection() {
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
        <SectionHeading eyebrow="О Квалитех" title="ПОСТРОЕНИЕ" accent="БУДУЩЕЕ" description="С 2001 года Qualitech Machinery находится в авангарде промышленных инноваций." centered />
        <div className="mt-6 space-y-4 text-sm leading-relaxed tracking-[-0.02em] text-[#9f9fa9] sm:text-[15px]">
          {aboutParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-2">
          {aboutHighlights.map((highlight) => (
            <div key={highlight.value} className="rounded-xl border border-[#27272a] bg-[#18181b] px-5 py-5 text-left sm:px-6 sm:py-6">
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

function AdvantagesSection() {
  return (
    <section className="relative px-4 pb-16 pt-14 sm:px-5 sm:pb-20 sm:pt-16 md:px-6 lg:px-8 xl:px-10">
      <div className="absolute left-1/2 top-20 hidden h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[linear-gradient(28.86deg,rgba(243,244,246,0.2)_0%,rgba(0,0,0,0)_100%)] blur-[48px] xl:block" />
      <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-[180px] bg-[rgba(255,105,0,0.08)] xl:block" />
      <div className="relative mx-auto max-w-[1120px] xl:max-w-[1200px]">
        <SectionHeading eyebrow="Почему выбирают нас" title="QUALITECH" accent="ПРЕИМУЩЕСТВО" description="Совершенство, достигнутое благодаря инновациям, качеству и приверженности делу." centered />
        <div className="mt-12 grid gap-4 pt-5 sm:grid-cols-2 sm:gap-5 sm:pt-6 lg:mt-14 xl:mx-auto xl:max-w-[1020px] xl:grid-cols-4 xl:gap-6">
          {advantageCards.map((card) => (
            <article key={card.index} className="relative overflow-visible">
              <div className="relative min-h-[228px] overflow-hidden rounded-lg border border-[#18181b] bg-[#09090b] px-4 pb-5 pt-11 sm:min-h-[248px] sm:px-5 sm:pb-6 sm:pt-12">
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-1.5 right-2 z-0 select-none text-right font-black leading-[0.78] tracking-[-0.06em] text-[rgba(255,255,255,0.08)] text-[clamp(3.1rem,10.5vw,5.25rem)] sm:bottom-2 sm:right-3"
                >
                  {card.index}
                </span>
                <div className="relative z-10">
                  <h3 className="text-center text-xs font-black uppercase leading-snug tracking-[0.02em] text-white sm:text-sm">{card.title}</h3>
                  <p className="mt-3 text-center text-[10px] leading-relaxed tracking-[-0.01em] text-[#71717b] sm:mt-3.5 sm:text-[11px]">{card.description}</p>
                </div>
              </div>
              <div className="absolute left-1/2 top-0 z-20 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[11px] bg-[#ff6900] shadow-[0_6px_20px_rgba(255,105,0,0.27)] sm:size-12 sm:rounded-xl">
                <Image alt="" className="size-6 sm:size-7" src={card.iconSrc} width={28} height={28} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function InsightsSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-5 sm:pb-20 sm:pt-16 md:px-6 lg:px-8 xl:px-10" id="insights">
      <div className="absolute right-[8%] top-12 hidden h-[520px] w-[900px] rounded-full bg-[linear-gradient(28.86deg,rgba(243,244,246,0.2)_0%,rgba(0,0,0,0)_100%)] blur-[48px] xl:block" />
      <div className="mx-auto max-w-[1280px] xl:max-w-[1360px]">
        <SectionHeading eyebrow="Последние сведения" title="НОВОСТИ ОТРАСЛИ" accent="" description="Будьте в курсе последних тенденций, советов и инноваций в области промышленного оборудования." />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:mt-12 xl:grid-cols-4 xl:gap-8">
          {articleCards.map((article) => (
            <article className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[#18181b] bg-black p-px">
              <div className="relative h-[172px] shrink-0 overflow-hidden rounded-t-[12px] bg-[#18181b] sm:h-[190px] lg:h-[200px]">
                <Image alt={article.title} className="object-cover" fill sizes="(min-width: 1280px) 320px, 100vw" src={article.imageSrc} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-[rgba(0,0,0,0.4)] to-transparent" />
                <span className="absolute left-3 top-3 rounded-lg bg-[#ff6900] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-black sm:left-4 sm:top-4 sm:px-3 sm:text-[10px] sm:tracking-[0.14em]">{article.category}</span>
              </div>
              <div className="flex min-h-[212px] flex-1 flex-col px-4 py-4 sm:min-h-[232px] sm:px-5 sm:py-5 xl:min-h-[252px]">
                <div className="flex flex-wrap items-center gap-3 text-[9px] uppercase tracking-[0.12em] text-[#52525c] sm:gap-4 sm:text-[11px] sm:tracking-[0.14em]">
                  <span className="flex items-center gap-1.5"><Image alt="" src={article.dateIconSrc} width={14} height={14} />{article.date}</span>
                  <span className="flex items-center gap-1.5"><Image alt="" src={article.timeIconSrc} width={14} height={14} />{article.readTime}</span>
                </div>
                <h3 className="mt-3 text-sm font-bold leading-snug tracking-[-0.02em] text-white sm:mt-4 sm:text-base">{article.title}</h3>
                <p className="mt-3 min-h-0 flex-1 text-xs leading-relaxed tracking-[-0.02em] text-[#71717b] sm:mt-4 sm:text-sm">{article.description}</p>
                <Link className="mt-4 inline-flex shrink-0 items-center gap-1 self-start text-[11px] font-bold uppercase tracking-[0.12em] text-[#ff6900] sm:mt-5 sm:text-xs sm:tracking-[0.14em]" href="#footer">
                  Читать далее
                  <Image alt="" src={article.arrowIconSrc} width={18} height={18} />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 flex justify-center sm:mt-12">
          <button className="flex h-11 items-center gap-2 rounded-full bg-[#ff6900] px-8 text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-[0_8px_24px_rgba(255,105,0,0.3)] sm:h-12 sm:gap-3 sm:px-9 sm:text-xs sm:tracking-[0.14em]" type="button">
            Узнайте больше
            <Image alt="" src={homeAssets.primaryArrow} width={20} height={20} />
          </button>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="mx-auto max-w-[1280px] px-4 pb-12 pt-8 sm:px-5 md:px-6 lg:px-8 xl:max-w-[1360px] xl:px-10" id="footer">
      <div className="grid gap-10 border-t border-[#18181b] pt-12 sm:gap-12 sm:pt-14 xl:grid-cols-[1.1fr_0.9fr_1fr_1fr]">
        <div>
          <Image alt="Qualitech logo" className="h-auto w-[260px] max-w-full sm:w-[300px]" src={homeAssets.footerLogo} width={338} height={46} />
          <p className="mt-6 max-w-[220px] text-xs leading-relaxed tracking-[-0.02em] text-[#52525c] sm:mt-7 sm:max-w-[239px] sm:text-sm">Ведущий поставщик решений в области промышленного оборудования с более чем 25-летним опытом внедрения инноваций в производстве.</p>
          <div className="mt-6 flex gap-2 sm:mt-7 sm:gap-3">{homeAssets.socialIcons.map((icon) => <span key={icon} className="grid size-9 place-items-center rounded-lg border border-[rgba(255,255,255,0.42)] bg-[#18181b] sm:size-10 sm:rounded-[10px]"><Image alt="" src={icon} width={18} height={18} /></span>)}</div>
        </div>
        {footerSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-black uppercase tracking-[0.01em] text-white sm:text-base">{section.title}</h3>
            <ul className="mt-4 space-y-2.5 text-[11px] uppercase tracking-[0.12em] text-[#52525c] sm:mt-5 sm:space-y-3 sm:text-xs sm:tracking-[0.14em]">{section.links.map((link) => <li key={link}>{link}</li>)}</ul>
          </div>
        ))}
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.01em] text-white sm:text-base">Контактная информация</h3>
          <div className="mt-4 space-y-3 text-[11px] tracking-[-0.01em] text-[#52525c] sm:mt-5 sm:text-xs">
            <div className="flex gap-3"><Image alt="" className="mt-0.5 size-3.5 shrink-0" src={homeAssets.locationIcon} width={CONTACT_INFO_ICON_SIZE_PX} height={CONTACT_INFO_ICON_SIZE_PX} /><p>1250 Индастриал-Паркуэй<br />Промышленный район, Мэриленд, 21201</p></div>
            <p className="flex items-center gap-3"><Image alt="" className="size-3.5 shrink-0" src={homeAssets.phoneIcon} width={CONTACT_INFO_ICON_SIZE_PX} height={CONTACT_INFO_ICON_SIZE_PX} />+1 (234) 567-890</p>
            <p className="flex items-center gap-3"><Image alt="" className="size-3.5 shrink-0" src={homeAssets.emailIcon} width={CONTACT_INFO_ICON_SIZE_PX} height={CONTACT_INFO_ICON_SIZE_PX} />info@qualitech.com</p>
          </div>
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-4 border-t border-[#18181b] pt-6 sm:mt-12 sm:pt-7 xl:flex-row xl:items-center xl:justify-between">
        <p className="font-legal text-[10px] uppercase text-[#52525c] sm:text-xs">Авторские права © 2017–2026 Neetrino IT Company. Все права защищены.</p>
        <div className="flex flex-wrap gap-2 text-[10px] tracking-[-0.01em] text-[#99a1af] sm:justify-end sm:gap-3 sm:text-xs">{legalLinks.map((item) => <span key={item}>{item}</span>)}</div>
      </div>
    </footer>
  );
}

export function HomePage() {
  return (
    <main className="relative overflow-x-hidden bg-[linear-gradient(201deg,#252525_14.56%,#000_90.79%)] text-white">
      <SiteHeader />
      <HeroSection />
      <SolutionsSection />
      <AboutSection />
      <AdvantagesSection />
      <InsightsSection />
      <SiteFooter />
    </main>
  );
}
