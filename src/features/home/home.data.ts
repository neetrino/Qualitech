export type NavItemMeta = {
  readonly id: "home" | "machines" | "about" | "blog" | "contact";
  readonly href: string;
};

export type SolutionCardLayout = {
  readonly index: string;
  readonly imageSrc: string;
};

export type AdvantageCardLayout = {
  readonly index: string;
  readonly iconSrc: string;
};

export type ArticleCardLayout = {
  readonly imageSrc: string;
  readonly dateIconSrc: string;
  readonly timeIconSrc: string;
  readonly arrowIconSrc: string;
};

export const homeAssets = {
  heroBackdrop: "/home/i-mg-ch-at-gp-ti-ma-ge-ap-r12026-at023607-pm1.png",
  robotArm: "/home/i-mg-de-si-gn-st-ud-ie-s07-ro-bo-ti-ca-rm3.png",
  heroGlow: "/home/i-mg-el-li-ps-e14.svg",
  headerLogo: "/home/i-mg-la-ye-r2.svg",
  footerLogo: "/home/i-mg-la-ye-r1.svg",
  languageIcon: "/home/i-mg-gr-ou-p70643.svg",
  languageAccent: "/home/i-mg-ve-ct-or.svg",
  languageArrow: "/home/i-mg-ar-ro-w2.svg",
  primaryArrow: "/home/i-mg-ic-on6.svg",
  linkArrow: "/home/i-mg-ic-on.svg",
  linkArrowAlt: "/home/i-mg-ic-on1.svg",
  playIcon: "/home/i-mg-ic-on11.svg",
  locationIcon: "/home/i-mg-ic-on12.svg",
  phoneIcon: "/home/i-mg-ic-on13.svg",
  emailIcon: "/home/i-mg-ic-on14.svg",
  socialIcons: [
    "/home/i-mg-ic-on15.svg",
    "/home/i-mg-ic-on16.svg",
    "/home/i-mg-ic-on17.svg",
    "/home/i-mg-ic-on18.svg",
  ] as const,
} as const;

export const navItemsMeta: readonly NavItemMeta[] = [
  { id: "home", href: "#hero" },
  { id: "machines", href: "#solutions" },
  { id: "about", href: "#about" },
  { id: "blog", href: "#insights" },
  /** `href` ignored for `contact`; header uses `/{locale}/contact`. */
  { id: "contact", href: "/contact" },
] as const;

export const solutionCardsLayout: readonly SolutionCardLayout[] = [
  { index: "01", imageSrc: "/home/i-mg-im-ag-ew-it-hf-al-lb-ac-k.jpg" },
  { index: "02", imageSrc: "/home/i-mg-im-ag-ew-it-hf-al-lb-ac-k1.jpg" },
  { index: "03", imageSrc: "/home/i-mg-im-ag-ew-it-hf-al-lb-ac-k2.jpg" },
] as const;

export const advantageCardsLayout: readonly AdvantageCardLayout[] = [
  { index: "01", iconSrc: "/home/i-mg-ic-on2.svg" },
  { index: "02", iconSrc: "/home/i-mg-ic-on3.svg" },
  { index: "03", iconSrc: "/home/i-mg-ic-on4.svg" },
  { index: "04", iconSrc: "/home/i-mg-ic-on5.svg" },
] as const;

export const articleCardsLayout: readonly ArticleCardLayout[] = [
  {
    imageSrc: "/home/i-mg-im-ag-ew-it-hf-al-lb-ac-k3.jpg",
    dateIconSrc: "/home/i-mg-ic-on7.svg",
    timeIconSrc: "/home/i-mg-ic-on8.svg",
    arrowIconSrc: "/home/i-mg-ic-on.svg",
  },
  {
    imageSrc: "/home/i-mg-im-ag-ew-it-hf-al-lb-ac-k4.jpg",
    dateIconSrc: "/home/i-mg-ic-on7.svg",
    timeIconSrc: "/home/i-mg-ic-on8.svg",
    arrowIconSrc: "/home/i-mg-ic-on.svg",
  },
  {
    imageSrc: "/home/i-mg-im-ag-ew-it-hf-al-lb-ac-k5.jpg",
    dateIconSrc: "/home/i-mg-ic-on9.svg",
    timeIconSrc: "/home/i-mg-ic-on10.svg",
    arrowIconSrc: "/home/i-mg-ic-on1.svg",
  },
  {
    imageSrc: "/home/i-mg-im-ag-ew-it-hf-al-lb-ac-k3.jpg",
    dateIconSrc: "/home/i-mg-ic-on9.svg",
    timeIconSrc: "/home/i-mg-ic-on10.svg",
    arrowIconSrc: "/home/i-mg-ic-on1.svg",
  },
] as const;
