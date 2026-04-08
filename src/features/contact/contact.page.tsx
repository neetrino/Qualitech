import Image from "next/image";
import Link from "next/link";

import { ContactFormClient } from "@/features/contact/contact-form.client";
import type { ContactMessages } from "@/features/contact/contact.messages";
import { homeAssets } from "@/features/home/home.data";
import {
  HERO_CONTENT_TOP_PAD,
  HOME_PAGE_BACKGROUND_CLASS,
  HeroBackgroundLayers,
} from "@/features/home/home-hero-visual";
import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";
import { homePageHref } from "@/lib/i18n/locale-routes";
import { Footer } from "@/shared/layout/footer";
import { Header } from "@/shared/layout/header";
import { SiteBreadcrumb } from "@/shared/layout/site-breadcrumb";

const CONTACT_ICON_SIZE_PX = 14;

type ContactPageProps = {
  readonly locale: HomeLocale;
  readonly homeMessages: HomeMessages;
  readonly contactMessages: ContactMessages;
};

function buildTelHref(display: string): string {
  return `tel:${display.replace(/[^\d+]/g, "")}`;
}

export function ContactPage({ locale, homeMessages, contactMessages }: ContactPageProps) {
  const c = contactMessages;
  const fc = homeMessages.footer.contact;

  return (
    <main className={`relative ${HOME_PAGE_BACKGROUND_CLASS} text-white`}>
      <Header locale={locale} messages={homeMessages} navContext="site" />
      <div className="overflow-x-hidden">
        <section className="relative min-h-[min(52svh,560px)] overflow-hidden lg:min-h-[480px]">
          <HeroBackgroundLayers />
          <div
            className={`relative z-[2] mx-auto flex w-full max-w-[1380px] flex-col px-4 pb-10 sm:px-5 sm:pb-12 md:px-6 lg:px-8 xl:px-10 ${HERO_CONTENT_TOP_PAD}`}
          >
            <SiteBreadcrumb
              segments={[
                { label: homeMessages.nav.home, href: homePageHref(locale) },
                { label: homeMessages.nav.contact },
              ]}
            />
            <div className="mb-4 flex items-center gap-2">
              <span className="h-px w-10 rounded-full bg-[#ff6900]" />
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ff6900] sm:text-xs">{c.heroEyebrow}</p>
            </div>
            <h1 className="max-w-[720px] font-display text-[clamp(1.5rem,4.2vw,2.75rem)] uppercase leading-[1.05] tracking-[-0.04em] text-white">
              {c.heroTitle}
            </h1>
            <p className="mt-4 max-w-[560px] text-sm leading-6 text-[#9f9fa9] sm:text-[15px] sm:leading-7">{c.heroSubtitle}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 pb-16 pt-4 sm:px-5 md:px-6 lg:px-8 xl:max-w-[1360px] xl:px-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
            <div className="space-y-8">
              <div>
                {c.infoTitle.length > 0 ? (
                  <h2 className="text-sm font-black uppercase tracking-[0.08em] text-white sm:text-base">{c.infoTitle}</h2>
                ) : null}
                <ul className={`space-y-4 text-sm text-[#9f9fa9] ${c.infoTitle.length > 0 ? "mt-5" : ""}`}>
                  <li className="flex gap-3">
                    <Image
                      alt=""
                      className="mt-0.5 size-3.5 shrink-0"
                      height={CONTACT_ICON_SIZE_PX}
                      src={homeAssets.locationIcon}
                      width={CONTACT_ICON_SIZE_PX}
                    />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#71717b]">{c.labels.address}</p>
                      <p className="mt-1 text-[#e4e4e7]">
                        {fc.addressLine1}
                        <br />
                        {fc.addressLine2}
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Image
                      alt=""
                      className="mt-0.5 size-3.5 shrink-0"
                      height={CONTACT_ICON_SIZE_PX}
                      src={homeAssets.phoneIcon}
                      width={CONTACT_ICON_SIZE_PX}
                    />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#71717b]">{c.labels.phone}</p>
                      <a className="mt-1 inline-block text-[#ff6900] transition hover:brightness-110" href={buildTelHref(fc.phone)}>
                        {fc.phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Image
                      alt=""
                      className="mt-0.5 size-3.5 shrink-0"
                      height={CONTACT_ICON_SIZE_PX}
                      src={homeAssets.emailIcon}
                      width={CONTACT_ICON_SIZE_PX}
                    />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#71717b]">{c.labels.email}</p>
                      <a className="mt-1 inline-block break-all text-[#ff6900] transition hover:brightness-110" href={`mailto:${fc.email}`}>
                        {fc.email}
                      </a>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-sm font-black uppercase tracking-[0.08em] text-white sm:text-base">{c.socialTitle}</h2>
                <ul className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                  {c.socialLinks.map((item) => (
                    <li key={item.href}>
                      <Link
                        className="inline-flex items-center justify-center rounded-full border border-[#27272a] bg-[#09090b] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#e4e4e7] transition hover:border-[#ff6900] hover:text-[#ff6900]"
                        href={item.href}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-sm font-black uppercase tracking-[0.08em] text-white sm:text-base">{c.mapTitle}</h2>
                <div className="mt-4 overflow-hidden rounded-xl border border-[#18181b] bg-[#09090b]">
                  <iframe
                    allowFullScreen
                    className="aspect-[16/10] min-h-[220px] w-full border-0 sm:min-h-[280px]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={c.mapEmbedUrl}
                    title={c.mapAria}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#18181b] bg-[#09090b] p-6 sm:p-8">
              <h2 className="text-sm font-black uppercase tracking-[0.08em] text-white sm:text-base">{c.formTitle}</h2>
              <div className="mt-6">
                <ContactFormClient messages={c.form} />
              </div>
            </div>
          </div>
        </section>

        <Footer locale={locale} messages={homeMessages} />
      </div>
    </main>
  );
}
