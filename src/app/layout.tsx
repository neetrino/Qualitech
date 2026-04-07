import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Sans, Inter, Prosto_One } from "next/font/google";

import { SITE_TAB_TITLE } from "@/lib/site-metadata";

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

export const metadata: Metadata = {
  title: SITE_TAB_TITLE,
  description: "Precision industrial machinery, robotics, and automation solutions by Qualitech Machinery.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${prostoOne.variable} ${dmSans.variable} min-h-dvh bg-black antialiased`}>
        {children}
      </body>
    </html>
  );
}
