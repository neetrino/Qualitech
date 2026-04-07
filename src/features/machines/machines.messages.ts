import { cache } from "react";

import type { HomeLocale } from "@/features/home/home.messages";
import type machinesEn from "../../../locales/en/Machines.json";

export type MachinesMessages = typeof machinesEn;

const loaders: Record<HomeLocale, () => Promise<{ default: MachinesMessages }>> = {
  en: () => import("../../../locales/en/Machines.json"),
  ru: () => import("../../../locales/ru/Machines.json"),
};

export const loadMachinesMessages = cache(async (locale: HomeLocale): Promise<MachinesMessages> => {
  const mod = await loaders[locale]();
  return mod.default;
});
