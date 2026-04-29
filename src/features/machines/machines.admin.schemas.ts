import { AppLocale } from "@prisma/client";
import { z } from "zod";

import { htmlToPlainText } from "@/lib/html/html-to-plain-excerpt";

const localeEnum = z.nativeEnum(AppLocale);

export const adminMachineTranslationSchema = z.object({
  locale: localeEnum,
  title: z.string().trim().min(1).max(300),
  slug: z.string().trim().min(1).max(200),
  description: z
    .string()
    .trim()
    .max(500_000)
    .refine((s) => htmlToPlainText(s).length > 0, "Description is required"),
  metaTitle: z.string().trim().max(300).nullable().optional(),
  metaDescription: z.string().trim().max(20_000).nullable().optional(),
  ogImageUrl: z.string().trim().url().max(2000).nullable().optional(),
});

export const adminMachineImageSchema = z.object({
  url: z.string().trim().url().max(2000),
  alt: z.string().trim().max(300).nullable().optional(),
  sortOrder: z.number().int().min(0).default(0),
  isPrimary: z.boolean().default(false),
});

const adminMachinePdfUrlSchema = z.union([z.string().trim().url().max(2000), z.null()]).optional();

export const adminMachineCreateSchema = z
  .object({
    categoryId: z.string().trim().cuid().nullable().optional(),
    featured: z.boolean().default(false),
    sortOrder: z.number().int().min(0).default(0),
    translations: z.array(adminMachineTranslationSchema).min(1),
    images: z.array(adminMachineImageSchema).default([]),
    pdfUrl: adminMachinePdfUrlSchema,
  })
  .superRefine((val, ctx) => {
    const locales = val.translations.map((t) => t.locale);
    if (new Set(locales).size !== locales.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Each locale must appear once in translations" });
    }
  });

export type AdminMachineCreateInput = z.infer<typeof adminMachineCreateSchema>;

export const adminMachinePatchSchema = z
  .object({
    categoryId: z.string().trim().cuid().nullable().optional(),
    featured: z.boolean().optional(),
    published: z.boolean().optional(),
    sortOrder: z.number().int().min(0).optional(),
    translations: z.array(adminMachineTranslationSchema).min(1).optional(),
    images: z.array(adminMachineImageSchema).optional(),
    pdfUrl: adminMachinePdfUrlSchema,
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

export type AdminMachinePatchInput = z.infer<typeof adminMachinePatchSchema>;

export type AdminMachineImageInput = z.infer<typeof adminMachineImageSchema>;

export const adminMachineIdParamSchema = z.object({
  id: z.string().cuid(),
});
