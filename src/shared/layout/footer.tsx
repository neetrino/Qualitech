import Image from "next/image";
import Link from "next/link";

import { FOOTER_SOCIAL_HREFS, homeAssets } from "@/features/home/home.data";
import type { HomeLocale, HomeMessages } from "@/features/home/home.messages";
import {
  aboutPageHref,
  blogPageHref,
  contactPageHref,
  homePageHref,
  machinesPageHref,
} from "@/lib/i18n/locale-routes";

const CONTACT_INFO_ICON_SIZE_PX = 18;
/** Matches the three solution cards on the home page (footer service lines 1–3). */
const FOOTER_SERVICE_LINES_LINKED_TO_SOLUTIONS = 3;

type FooterProps = {
  readonly locale: HomeLocale;
  readonly messages: HomeMessages;
};

function quickLinkHref(locale: HomeLocale, index: number): string {
  switch (index) {
    case 0:
      return machinesPageHref(locale);
    case 1:
      return aboutPageHref(locale);
    case 2:
      return blogPageHref(locale);
    case 3:
      return contactPageHref(locale);
    default:
      return homePageHref(locale);
  }
}

function serviceLinkHref(locale: HomeLocale, index: number): string {
  if (index < FOOTER_SERVICE_LINES_LINKED_TO_SOLUTIONS) {
    return `${homePageHref(locale)}#solutions`;
  }
  return contactPageHref(locale);
}

const footerLinkClassName =
  "transition hover:text-[#a1a1aa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6900]";

const footerSocialLinkClassName =
  "grid size-9 place-items-center rounded-lg border border-[rgba(255,255,255,0.42)] bg-[#18181b] transition hover:border-[#ff6900] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6900] sm:size-10 sm:rounded-[10px]";

export function Footer({ locale, messages }: FooterProps) {
  const footerColumns = [
    { title: messages.footer.quickLinks.title, links: messages.footer.quickLinks.links },
    { title: messages.footer.services.title, links: messages.footer.services.links },
  ] as const;

  return (
    <footer className="mx-auto hidden max-w-[1280px] px-4 pb-12 pt-8 sm:px-5 md:block md:px-6 lg:px-8 xl:max-w-[1360px] xl:px-10" id="footer">
      <div className="grid gap-10 border-t border-[#18181b] pt-12 sm:gap-12 sm:pt-14 xl:grid-cols-[1.1fr_0.9fr_1fr_1fr]">
        <div>
          <Link className="inline-block" href={homePageHref(locale)}>
            <Image alt="Qualitech logo" className="h-auto w-[260px] max-w-full sm:w-[300px]" src={homeAssets.footerLogo} width={338} height={46} />
          </Link>
          <p className="mt-6 max-w-[220px] text-xs leading-relaxed tracking-[-0.02em] text-[#52525c] sm:mt-7 sm:max-w-[239px] sm:text-sm">{messages.footer.tagline}</p>
          <div className="mt-6 flex gap-2 sm:mt-7 sm:gap-3">
            {homeAssets.socialIcons.map((icon, index) => {
              const href = FOOTER_SOCIAL_HREFS[index];
              const label = messages.footer.socialLinks[index]?.label ?? "Social";
              const iconNode = <Image alt="" src={icon} width={18} height={18} />;
              if (href.length === 0) {
                return (
                  <span key={icon} className={footerSocialLinkClassName}>
                    {iconNode}
                  </span>
                );
              }
              return (
                <a
                  key={icon}
                  aria-label={label}
                  className={footerSocialLinkClassName}
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {iconNode}
                </a>
              );
            })}
          </div>
        </div>
        {footerColumns.map((section, sectionIndex) => (
          <div key={section.title}>
            <h3 className="text-sm font-black uppercase tracking-[0.01em] text-white sm:text-base">{section.title}</h3>
            <ul className="mt-4 space-y-2.5 text-[11px] uppercase tracking-[0.12em] text-[#52525c] sm:mt-5 sm:space-y-3 sm:text-xs sm:tracking-[0.14em]">
              {section.links.map((link, linkIndex) => {
                const href =
                  sectionIndex === 0 ? quickLinkHref(locale, linkIndex) : serviceLinkHref(locale, linkIndex);
                return (
                  <li key={`${section.title}-${link}`}>
                    <Link className={footerLinkClassName} href={href}>
                      {link}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.01em] text-white sm:text-base">{messages.footer.contact.title}</h3>
          <div className="mt-4 space-y-3 text-[11px] tracking-[-0.01em] text-[#52525c] sm:mt-5 sm:text-xs">
            <div className="flex gap-3">
              <Image alt="" className="mt-0.5 shrink-0" src={homeAssets.locationIcon} width={CONTACT_INFO_ICON_SIZE_PX} height={CONTACT_INFO_ICON_SIZE_PX} />
              <p>
                {messages.footer.contact.addressLine1}
                <br />
                {messages.footer.contact.addressLine2}
              </p>
            </div>
            <p className="flex items-center gap-3">
              <Image alt="" className="shrink-0" src={homeAssets.phoneIcon} width={CONTACT_INFO_ICON_SIZE_PX} height={CONTACT_INFO_ICON_SIZE_PX} />
              {messages.footer.contact.phone}
            </p>
            <p className="flex items-center gap-3">
              <Image alt="" className="shrink-0" src={homeAssets.emailIcon} width={CONTACT_INFO_ICON_SIZE_PX} height={CONTACT_INFO_ICON_SIZE_PX} />
              <a className="break-all text-[#ff6900] transition hover:brightness-110" href={`mailto:${messages.footer.contact.email}`}>
                {messages.footer.contact.email}
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-[#18181b] pt-6 sm:mt-12 sm:pt-7">
        <p className="font-legal text-[10px] uppercase text-[#52525c] sm:text-xs">{messages.footer.copyright}</p>
      </div>
    </footer>
  );
}
