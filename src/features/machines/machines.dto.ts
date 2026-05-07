import type { HomeLocale } from "@/features/home/home.messages";

export type MachineCategoryBriefDto = {
  slug: string;
  name: string;
};

export type MachineImageDto = {
  url: string;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export type MachineListItemDto = {
  id: string;
  slug: string;
  title: string;
  /** Plain text excerpt for cards (from rich description). */
  descriptionExcerpt: string;
  featured: boolean;
  category: MachineCategoryBriefDto | null;
  coverImage: MachineImageDto | null;
};

export type MachineDetailDto = {
  id: string;
  slug: string;
  title: string;
  /** Sanitized rich HTML. */
  description: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  featured: boolean;
  category: MachineCategoryBriefDto | null;
  images: MachineImageDto[];
  /** Product sheet / brochure URL when set in admin. */
  pdfUrl: string | null;
  /** Optional Excel (.xlsx / .xls) specs URL when set in admin. */
  excelUrl: string | null;
  /** Optional images for the specifications block (separate from gallery). */
  excelImageUrls: string[];
};

export type MachinesListResult = {
  data: MachineListItemDto[];
  meta: { page: number; limit: number; total: number };
};

/** Top-level catalog section card on `/[locale]/machines`. */
export type MachineCategoryCardDto = {
  slug: string;
  name: string;
  coverImage: MachineImageDto | null;
  homeDescription: string | null;
  homeBullets: string[];
};

export type MachineDetailWithLocaleSlugs = {
  detail: MachineDetailDto;
  slugByLocale: Partial<Record<HomeLocale, string>>;
  sectionSlugByLocale: Partial<Record<HomeLocale, string>>;
};

export type MachineCategorySectionContextDto = {
  name: string;
  slugByLocale: Partial<Record<HomeLocale, string>>;
};
