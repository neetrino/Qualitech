import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Sans, Inter, Prosto_One } from "next/font/google";

import {
  GOOGLE_SITE_VERIFICATION_CONTENT,
  YANDEX_VERIFICATION_CONTENT,
} from "@/lib/analytics/analytics.constants";
import { SITE_OG_DESCRIPTION, SITE_OG_TITLE, SITE_TAB_TITLE } from "@/lib/site-metadata";
import { SiteAnalytics } from "@/shared/analytics/site-analytics";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const prostoOne = Prosto_One({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-legal",
  preload: false,
});

const trimmedAppUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
const METADATA_BASE_URL =
  trimmedAppUrl && trimmedAppUrl.length > 0 ? trimmedAppUrl : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(METADATA_BASE_URL),
  title: SITE_TAB_TITLE,
  description: SITE_OG_DESCRIPTION,
  verification: {
    google: GOOGLE_SITE_VERIFICATION_CONTENT,
    yandex: YANDEX_VERIFICATION_CONTENT,
  },
  openGraph: {
    title: SITE_OG_TITLE,
    description: SITE_OG_DESCRIPTION,
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_OG_TITLE,
    description: SITE_OG_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${prostoOne.variable} ${dmSans.variable} min-h-dvh bg-black antialiased`}>
        <SiteAnalytics />
        {children}
      </body>
    </html>
  );
}
