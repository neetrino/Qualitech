import Link from "next/link";

import type { ContactMessages } from "@/features/contact/contact.messages";
import { HOME_PAGE_BACKGROUND_CLASS } from "@/features/home/home-hero-visual";
import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";
import { contactPageHref, homePageHref } from "@/lib/i18n/locale-routes";
import { Footer } from "@/shared/layout/footer";
import { MOBILE_BOTTOM_TAB_BAR_PAD } from "@/shared/layout/mobile-tab-bar.constants";
import { SiteHeader } from "@/shared/layout/site-header";

type ContactThanksPageProps = {
  readonly locale: HomeLocale;
  readonly homeMessages: HomeMessages;
  readonly contactMessages: ContactMessages;
};

export function ContactThanksPage({ locale, homeMessages, contactMessages }: ContactThanksPageProps) {
  const t = contactMessages.thanks;

  return (
    <main className={`relative ${HOME_PAGE_BACKGROUND_CLASS} text-white ${MOBILE_BOTTOM_TAB_BAR_PAD}`}>
      <SiteHeader locale={locale} messages={homeMessages} navContext="site" />
      <section className="mx-auto flex min-h-[60vh] w-full max-w-[920px] items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full rounded-2xl border border-emerald-500/25 bg-[#09090b] p-8 text-center shadow-[0_0_0_1px_rgba(16,185,129,0.12),0_20px_45px_rgba(0,0,0,0.35)] sm:p-12">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-emerald-400/35 bg-emerald-500/15 text-emerald-300 shadow-[0_10px_25px_rgba(16,185,129,0.25)]">
            <svg aria-hidden="true" className="size-8" fill="none" viewBox="0 0 24 24">
              <path d="M20 7L10 17l-5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" />
            </svg>
          </div>
          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300/85">{t.eyebrow}</p>
          <h1 className="mt-4 font-display text-[clamp(1.6rem,4.2vw,2.8rem)] uppercase leading-[1.05] tracking-[-0.04em] text-white">
            {t.title}
          </h1>
          <p className="mx-auto mt-4 max-w-[600px] text-sm leading-7 text-[#9f9fa9] sm:text-[15px]">{t.subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-500 px-6 text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-[0_8px_14px_rgba(16,185,129,0.28)] transition hover:brightness-110 sm:h-12 sm:text-xs"
              href={homePageHref(locale)}
            >
              {t.homeCta}
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-full border border-emerald-700/40 bg-transparent px-6 text-[11px] font-black uppercase tracking-[0.12em] text-emerald-200 transition hover:border-emerald-400 hover:text-emerald-300 sm:h-12 sm:text-xs"
              href={contactPageHref(locale)}
            >
              {t.backCta}
            </Link>
          </div>
        </div>
      </section>
      <Footer locale={locale} messages={homeMessages} />
    </main>
  );
}
