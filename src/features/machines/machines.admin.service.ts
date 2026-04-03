import type { AdminMachineCreateInput, AdminMachinePatchInput } from "@/features/machines/machines.admin.schemas";
import {
  adminCreateMachine,
  adminDeleteMachine,
  adminGetMachineById,
  adminListMachines,
  adminUpdateMachine,
} from "@/features/machines/machines.admin.repository";

export async function listMachinesForAdmin() {
  return adminListMachines();
}

export async function getMachineForAdmin(id: string) {
  return adminGetMachineById(id);
}

export async function createMachineForAdmin(data: AdminMachineCreateInput) {
  return adminCreateMachine(data);
}

export async function updateMachineForAdmin(id: string, patch: AdminMachinePatchInput) {
  return adminUpdateMachine(id, patch);
}

export async function deleteMachineForAdmin(id: string): Promise<boolean> {
  return adminDeleteMachine(id);
}
