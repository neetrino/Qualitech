import { AppLocale } from "@prisma/client";
import { z } from "zod";

const localeEnum = z.nativeEnum(AppLocale);

export const adminBlogTranslationSchema = z.object({
  locale: localeEnum,
  title: z.string().trim().min(1).max(300),
  slug: z.string().trim().min(1).max(200),
  excerpt: z.string().trim().min(1).max(20_000),
  content: z.string().trim().min(1).max(500_000),
  metaTitle: z.string().trim().max(300).nullable().optional(),
  metaDescription: z.string().trim().max(20_000).nullable().optional(),
  ogImageUrl: z.string().trim().url().max(2000).nullable().optional(),
});

export const adminBlogImageSchema = z.object({
  url: z.string().trim().url().max(2000),
  alt: z.string().trim().max(300).nullable().optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export const adminBlogCreateSchema = z
  .object({
    published: z.boolean().default(false),
    publishedAt: z.coerce.date().nullable().optional(),
    translations: z.array(adminBlogTranslationSchema).min(1),
    images: z.array(adminBlogImageSchema).default([]),
  })
  .superRefine((val, ctx) => {
    const locales = val.translations.map((t) => t.locale);
    if (new Set(locales).size !== locales.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Each locale must appear once in translations" });
    }
  });

export type AdminBlogCreateInput = z.infer<typeof adminBlogCreateSchema>;

export const adminBlogPatchSchema = z
  .object({
    published: z.boolean().optional(),
    publishedAt: z.coerce.date().nullable().optional(),
    translations: z.array(adminBlogTranslationSchema).min(1).optional(),
    images: z.array(adminBlogImageSchema).optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.translations) {
      return;
    }
    const locales = val.translations.map((t) => t.locale);
    if (new Set(locales).size !== locales.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Each locale must appear once in translations" });
    }
  });

export type AdminBlogPatchInput = z.infer<typeof adminBlogPatchSchema>;

export const adminBlogIdParamSchema = z.object({
  id: z.string().cuid(),
});
