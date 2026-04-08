import type {
  AdminMachineCategoryCreateInput,
  AdminMachineCategoryPatchInput,
} from "@/features/machines/machines.admin-category.schemas";
import {
  adminCreateMachineCategory,
  adminGetMachineCategoryById,
  adminListMachineCategoriesTopLevel,
  adminTryDeleteMachineCategory,
  adminUpdateMachineCategory,
  type MachineCategoryAdminRow,
} from "@/features/machines/machines.admin-category.repository";

export async function listMachineCategoriesTopLevelForAdmin(): Promise<MachineCategoryAdminRow[]> {
  return adminListMachineCategoriesTopLevel();
}

export async function getMachineCategoryForAdmin(id: string): Promise<MachineCategoryAdminRow | null> {
  return adminGetMachineCategoryById(id);
}

export async function createMachineCategoryForAdmin(
  data: AdminMachineCategoryCreateInput,
): Promise<MachineCategoryAdminRow> {
  return adminCreateMachineCategory(data);
}

export async function updateMachineCategoryForAdmin(
  id: string,
  patch: AdminMachineCategoryPatchInput,
): Promise<MachineCategoryAdminRow | null> {
  return adminUpdateMachineCategory(id, patch);
}

export async function deleteMachineCategoryForAdmin(
  id: string,
): Promise<ReturnType<typeof adminTryDeleteMachineCategory>> {
  return adminTryDeleteMachineCategory(id);
}
