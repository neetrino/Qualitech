import { revalidateTag } from "next/cache";

import { MACHINE_CATEGORY_PUBLIC_CACHE_TAG } from "@/features/machines/machines.constants";

/** Call after admin create/update/delete of a machine category so home and catalog refresh. */
export function revalidateMachineCategoryPublicCaches(): void {
  revalidateTag(MACHINE_CATEGORY_PUBLIC_CACHE_TAG);
}
