import type { AdminMachineCreateInput, AdminMachinePatchInput } from "@/features/machines/machines.admin.schemas";
import { normalizeMachineImagesForWrite } from "@/features/machines/machines.admin.images";
import {
  adminCreateMachine,
  adminDeleteMachine,
  adminGetMachineById,
  adminListMachines,
  adminUpdateMachine,
} from "@/features/machines/machines.admin.repository";
import { sanitizeMachineDescriptionHtml } from "@/lib/html/sanitize-machine-description";

function mapTranslationsWithSanitizedDescriptions<T extends { description: string }>(translations: T[]): T[] {
  return translations.map((t) => ({
    ...t,
    description: sanitizeMachineDescriptionHtml(t.description),
  }));
}

export async function listMachinesForAdmin() {
  return adminListMachines();
}

export async function getMachineForAdmin(id: string) {
  return adminGetMachineById(id);
}

export async function createMachineForAdmin(data: AdminMachineCreateInput) {
  const images = normalizeMachineImagesForWrite(data.images);
  const translations = mapTranslationsWithSanitizedDescriptions(data.translations);
  return adminCreateMachine({
    ...data,
    translations,
    images,
  });
}

export async function updateMachineForAdmin(id: string, patch: AdminMachinePatchInput) {
  const translations = patch.translations
    ? mapTranslationsWithSanitizedDescriptions(patch.translations)
    : undefined;
  const images = patch.images ? normalizeMachineImagesForWrite(patch.images) : undefined;
  return adminUpdateMachine(id, {
    ...patch,
    translations,
    images,
  });
}

export async function deleteMachineForAdmin(id: string): Promise<boolean> {
  return adminDeleteMachine(id);
}
