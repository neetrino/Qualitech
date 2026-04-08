import { AppLocale } from "@prisma/client";
import { z } from "zod";

export const appLocaleSchema = z.nativeEnum(AppLocale);
