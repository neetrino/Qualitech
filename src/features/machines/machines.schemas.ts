import { z } from "zod";

import {
  MACHINES_LIST_DEFAULT_LIMIT,
  MACHINES_LIST_DEFAULT_PAGE,
  MACHINES_LIST_MAX_LIMIT,
} from "@/features/machines/machines.constants";
import { appLocaleSchema } from "@/lib/schemas/app-locale";

export { appLocaleSchema };

const optionalBooleanFromQuery = z
  .enum(["true", "false", "1", "0"])
  .optional()
  .transform((value) => {
    if (value === undefined) {
      return undefined;
    }
    return value === "true" || value === "1";
  });

export const machinesListQuerySchema = z.object({
  locale: appLocaleSchema,
  categorySlug: z.string().min(1).max(120).optional(),
  featured: optionalBooleanFromQuery,
  page: z.coerce.number().int().min(1).default(MACHINES_LIST_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MACHINES_LIST_MAX_LIMIT)
    .default(MACHINES_LIST_DEFAULT_LIMIT),
});

export type MachinesListQuery = z.infer<typeof machinesListQuerySchema>;

export const machineDetailQuerySchema = z.object({
  locale: appLocaleSchema,
});

export type MachineDetailQuery = z.infer<typeof machineDetailQuerySchema>;

export const machineSlugParamSchema = z.object({
  slug: z.string().min(1).max(200),
});

export type MachineSlugParam = z.infer<typeof machineSlugParamSchema>;
