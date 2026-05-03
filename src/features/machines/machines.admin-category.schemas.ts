import { AppLocale } from "@prisma/client";
import { z } from "zod";

import { normalizeMachineSlugForAdminStorage } from "@/lib/slug/normalize-machine-slug-for-admin";

const localeEnum = z.nativeEnum(AppLocale);

const adminMachineCategorySlugSchema = z
  .string()
  .trim()
  .max(120)
  .transform((s) => normalizeMachineSlugForAdminStorage(s))
  .pipe(z.string().min(1).max(120));

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
  slug: adminMachineCategorySlugSchema,
  homeDescription: optionalTrimmedText(4000),
  homeBullets: homeBulletsSchema,
});

export const adminMachineCategoryCreateSchema = z
  .object({
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
