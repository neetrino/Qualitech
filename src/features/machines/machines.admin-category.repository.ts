import type { Prisma } from "@prisma/client";

import type {
  AdminMachineCategoryCreateInput,
  AdminMachineCategoryPatchInput,
} from "@/features/machines/machines.admin-category.schemas";
import { prisma } from "@/lib/db";

const categoryAdminInclude = {
  translations: true,
} satisfies Prisma.MachineCategoryInclude;

export type MachineCategoryAdminRow = Prisma.MachineCategoryGetPayload<{ include: typeof categoryAdminInclude }>;

export async function adminListMachineCategoriesTopLevel(): Promise<MachineCategoryAdminRow[]> {
  return prisma.machineCategory.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
    include: categoryAdminInclude,
  });
}

export async function adminGetMachineCategoryById(id: string): Promise<MachineCategoryAdminRow | null> {
  return prisma.machineCategory.findFirst({
    where: { id, parentId: null },
    include: categoryAdminInclude,
  });
}

export async function adminCreateMachineCategory(
  data: AdminMachineCategoryCreateInput,
): Promise<MachineCategoryAdminRow> {
  return prisma.machineCategory.create({
    data: {
      parentId: null,
      sortOrder: data.sortOrder,
      imageUrl: data.imageUrl ?? null,
      translations: { create: data.translations },
    },
    include: categoryAdminInclude,
  });
}

function buildCategoryUpdateData(patch: AdminMachineCategoryPatchInput): Prisma.MachineCategoryUpdateInput {
  const data: Prisma.MachineCategoryUpdateInput = {};
  if (patch.sortOrder !== undefined) {
    data.sortOrder = patch.sortOrder;
  }
  if (patch.imageUrl !== undefined) {
    data.imageUrl = patch.imageUrl;
  }
  if (patch.translations) {
    data.translations = { deleteMany: {}, create: patch.translations };
  }
  return data;
}

export async function adminUpdateMachineCategory(
  id: string,
  patch: AdminMachineCategoryPatchInput,
): Promise<MachineCategoryAdminRow | null> {
  const exists = await prisma.machineCategory.findFirst({
    where: { id, parentId: null },
    select: { id: true },
  });
  if (!exists) {
    return null;
  }
  const data = buildCategoryUpdateData(patch);
  if (Object.keys(data).length > 0) {
    await prisma.machineCategory.update({ where: { id }, data });
  }
  return adminGetMachineCategoryById(id);
}

export type AdminCategoryDeleteBlockReason = "NOT_FOUND" | "HAS_CHILDREN" | "HAS_MACHINES";

export async function adminTryDeleteMachineCategory(
  id: string,
): Promise<{ ok: true } | { ok: false; reason: AdminCategoryDeleteBlockReason }> {
  const row = await prisma.machineCategory.findFirst({
    where: { id, parentId: null },
    select: { id: true },
  });
  if (!row) {
    return { ok: false, reason: "NOT_FOUND" };
  }
  const [childCount, machineCount] = await Promise.all([
    prisma.machineCategory.count({ where: { parentId: id } }),
    prisma.machine.count({ where: { categoryId: id } }),
  ]);
  if (childCount > 0) {
    return { ok: false, reason: "HAS_CHILDREN" };
  }
  if (machineCount > 0) {
    return { ok: false, reason: "HAS_MACHINES" };
  }
  await prisma.machineCategory.delete({ where: { id } });
  return { ok: true };
}
