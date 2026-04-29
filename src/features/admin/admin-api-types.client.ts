/** JSON shapes returned by admin blog / machine / contact APIs (dates as ISO strings). */

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  readAt: string | null;
};

export type BlogTranslationRow = {
  locale: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
};

export type BlogImageRow = {
  url: string;
  alt: string | null;
  sortOrder: number;
};

export type BlogRow = {
  id: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  translations: BlogTranslationRow[];
  images: BlogImageRow[];
};

export type MachineCategoryRow = {
  id: string;
  translations: Array<{
    locale: string;
    name: string;
    slug: string;
    homeDescription: string | null;
    homeBullets: string[];
  }>;
};

/** Top-level catalog section from `GET /api/admin/machine-categories`. */
export type MachineCategoryAdminRow = {
  id: string;
  parentId: string | null;
  sortOrder: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  translations: Array<{
    locale: string;
    name: string;
    slug: string;
    homeDescription: string | null;
    homeBullets: string[];
  }>;
};

export type MachineTranslationRow = {
  locale: string;
  title: string;
  slug: string;
  description: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
};

export type MachineImageRow = {
  url: string;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export type MachineRow = {
  id: string;
  categoryId: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  pdfUrl: string | null;
  createdAt: string;
  updatedAt: string;
  translations: MachineTranslationRow[];
  images: MachineImageRow[];
  category: MachineCategoryRow | null;
};
