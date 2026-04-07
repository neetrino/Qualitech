import type { Prisma } from "@prisma/client";

import type { AdminMachineCreateInput, AdminMachinePatchInput } from "@/features/machines/machines.admin.schemas";
import { prisma } from "@/lib/db";

const machineAdminInclude = {
  translations: true,
  images: { orderBy: [{ isPrimary: "desc" as const }, { sortOrder: "asc" as const }] },
  category: { include: { translations: true } },
} satisfies Prisma.MachineInclude;

export type MachineAdminRow = Prisma.MachineGetPayload<{ include: typeof machineAdminInclude }>;

export async function adminListMachines(): Promise<MachineAdminRow[]> {
  return prisma.machine.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: machineAdminInclude,
  });
}

export async function adminGetMachineById(id: string): Promise<MachineAdminRow | null> {
  return prisma.machine.findUnique({
    where: { id },
    include: machineAdminInclude,
  });
}

export async function adminCreateMachine(data: AdminMachineCreateInput): Promise<MachineAdminRow> {
  return prisma.machine.create({
    data: {
      categoryId: data.categoryId ?? null,
      featured: data.featured,
      published: true,
      sortOrder: data.sortOrder,
      translations: { create: data.translations },
      images: { create: data.images },
    },
    include: machineAdminInclude,
  });
}

function buildMachineUpdateData(patch: AdminMachinePatchInput): Prisma.MachineUpdateInput {
  const data: Prisma.MachineUpdateInput = {};
  if (patch.categoryId !== undefined) {
    data.category =
      patch.categoryId === null ? { disconnect: true } : { connect: { id: patch.categoryId } };
  }
  if (patch.featured !== undefined) {
    data.featured = patch.featured;
  }
  if (patch.published !== undefined) {
    data.published = patch.published;
  }
  if (patch.sortOrder !== undefined) {
    data.sortOrder = patch.sortOrder;
  }
  if (patch.translations) {
    data.translations = { deleteMany: {}, create: patch.translations };
  }
  if (patch.images) {
    data.images = { deleteMany: {}, create: patch.images };
  }
  return data;
}

export async function adminUpdateMachine(
  id: string,
  patch: AdminMachinePatchInput,
): Promise<MachineAdminRow | null> {
  const exists = await prisma.machine.findUnique({ where: { id }, select: { id: true } });
  if (!exists) {
    return null;
  }

  const data = buildMachineUpdateData(patch);
  const keys = Object.keys(data);
  if (keys.length > 0) {
    await prisma.machine.update({ where: { id }, data });
  }

  return adminGetMachineById(id);
}

export async function adminDeleteMachine(id: string): Promise<boolean> {
  const result = await prisma.machine.deleteMany({ where: { id } });
  return result.count > 0;
}
