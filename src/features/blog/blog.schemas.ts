import { z } from "zod";

import {
  BLOG_LIST_DEFAULT_LIMIT,
  BLOG_LIST_DEFAULT_PAGE,
  BLOG_LIST_MAX_LIMIT,
} from "@/features/blog/blog.constants";
import { appLocaleSchema } from "@/lib/schemas/app-locale";

export { appLocaleSchema };

export const blogListQuerySchema = z.object({
  locale: appLocaleSchema,
  page: z.coerce.number().int().min(1).default(BLOG_LIST_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(BLOG_LIST_MAX_LIMIT)
    .default(BLOG_LIST_DEFAULT_LIMIT),
});

export type BlogListQuery = z.infer<typeof blogListQuerySchema>;

export const blogDetailQuerySchema = z.object({
  locale: appLocaleSchema,
});

export type BlogDetailQuery = z.infer<typeof blogDetailQuerySchema>;

export const blogSlugParamSchema = z.object({
  slug: z.string().min(1).max(200),
});

export type BlogSlugParam = z.infer<typeof blogSlugParamSchema>;
