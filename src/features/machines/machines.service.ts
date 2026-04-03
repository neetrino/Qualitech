import type { AppLocale } from "@prisma/client";

import type { MachineDetailDto, MachinesListResult } from "@/features/machines/machines.dto";
import { mapMachineDetailRow, mapMachineListRow } from "@/features/machines/machines.mappers";
import {
  countMachinesForList,
  findMachineDetailBySlug,
  findMachinesForList,
} from "@/features/machines/machines.repository";
import type { MachinesListQuery } from "@/features/machines/machines.schemas";

export async function listMachinesPublic(query: MachinesListQuery): Promise<MachinesListResult> {
  const [total, rows] = await Promise.all([countMachinesForList(query), findMachinesForList(query)]);
  return {
    data: rows.map(mapMachineListRow),
    meta: { page: query.page, limit: query.limit, total },
  };
}

export async function getMachineBySlugPublic(
  slug: string,
  locale: AppLocale,
): Promise<MachineDetailDto | null> {
  const row = await findMachineDetailBySlug(slug, locale);
  if (!row) {
    return null;
  }
  return mapMachineDetailRow(row);
}
