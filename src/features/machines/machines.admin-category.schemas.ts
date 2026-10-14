import { AppLocale } from "@prisma/client";
import { z } from "zod";

import { createAdminSlugSchema } from "@/lib/slug/admin-slug.schema";

const localeEnum = z.nativeEnum(AppLocale);
const MAX_CATEGORY_SLUG_LENGTH = 120;

const adminMachineCategorySlugSchema = createAdminSlugSchema(MAX_CATEGORY_SLUG_LENGTH);

const optionalCategoryImageUrl = z
  .string()
  .trim()
  .url()
  .max(2000)
  .nullable()
  .optional();

const optionalTrimmedText = (max: number) =>
  z
    .string()
    .max(max)
    .optional()
    .transform((s): string | null => {
      if (s === undefined) {
        return null;
      }
      const t = s.trim();
      return t.length === 0 ? null : t;
    });

const homeBulletsSchema = z
  .array(z.string().max(200))
  .max(12)
  .optional()
  .transform((lines) => (lines ?? []).map((l) => l.trim()).filter((l) => l.length > 0));

export const adminMachineCategoryTranslationSchema = z.object({
  locale: localeEnum,
  name: z.string().trim().min(1).max(200),
  homeDescription: optionalTrimmedText(4000),
  homeBullets: homeBulletsSchema,
  metaDescription: z.string().trim().max(20_000).nullable().optional(),
  ogImageUrl: z.string().trim().url().max(2000).nullable().optional(),
});

export const adminMachineCategoryCreateSchema = z
  .object({
    slug: adminMachineCategorySlugSchema,
    sortOrder: z.number().int().min(0).default(0),
    featured: z.boolean().optional().default(true),
    published: z.boolean().optional().default(true),
    imageUrl: optionalCategoryImageUrl,
    translations: z.array(adminMachineCategoryTranslationSchema).min(1),
  })
  .superRefine((val, ctx) => {
    const locales = val.translations.map((t) => t.locale);
    if (new Set(locales).size !== locales.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Each locale must appear once in translations" });
    }
    if (!locales.includes(AppLocale.ru) || !locales.includes(AppLocale.en)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Both ru and en translations are required",
      });
    }
  });

export type AdminMachineCategoryCreateInput = z.infer<typeof adminMachineCategoryCreateSchema>;

export const adminMachineCategoryPatchSchema = z
  .object({
    slug: adminMachineCategorySlugSchema.optional(),
    sortOrder: z.number().int().min(0).optional(),
    featured: z.boolean().optional(),
    published: z.boolean().optional(),
    imageUrl: optionalCategoryImageUrl,
    translations: z.array(adminMachineCategoryTranslationSchema).min(1).optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.translations) {
      return;
    }
    const locales = val.translations.map((t) => t.locale);
    if (new Set(locales).size !== locales.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Each locale must appear once in translations" });
    }
    if (!locales.includes(AppLocale.ru) || !locales.includes(AppLocale.en)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Both ru and en translations are required",
      });
    }
  });

export type AdminMachineCategoryPatchInput = z.infer<typeof adminMachineCategoryPatchSchema>;

export const adminMachineCategoryIdParamSchema = z.object({
  id: z.string().cuid(),
});
