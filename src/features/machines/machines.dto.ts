export type MachineCategoryBriefDto = {
  slug: string;
  name: string;
};

export type MachineImageDto = {
  url: string;
  alt: string | null;
  sortOrder: number;
};

export type MachineListItemDto = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  featured: boolean;
  category: MachineCategoryBriefDto | null;
  coverImage: MachineImageDto | null;
};

export type MachineDetailDto = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  body: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  featured: boolean;
  category: MachineCategoryBriefDto | null;
  images: MachineImageDto[];
};

export type MachinesListResult = {
  data: MachineListItemDto[];
  meta: { page: number; limit: number; total: number };
};
