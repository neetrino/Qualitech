import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Sans, Inter, Prosto_One } from "next/font/google";

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
});

export const metadata: Metadata = {
  title: "Qualitech Machinery | Industrial Solutions",
  description: "Precision industrial machinery, robotics, and automation solutions by Qualitech Machinery.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${prostoOne.variable} ${dmSans.variable} min-h-dvh bg-black antialiased`}>
        {children}
      </body>
    </html>
  );
}
