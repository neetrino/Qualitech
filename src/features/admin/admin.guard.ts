import type { NextResponse } from "next/server";

import type { AdminSession } from "@/features/admin/auth/admin.auth.service";
import { getAdminSessionFromRequest } from "@/features/admin/auth/admin.auth.service";
import { jsonError } from "@/lib/http/api-error";

export type AdminGuardResult =
  | { ok: true; admin: AdminSession }
  | { ok: false; response: NextResponse };

export async function requireAdmin(request: Request): Promise<AdminGuardResult> {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return { ok: false, response: jsonError(401, "UNAUTHORIZED", "Authentication required") };
  }
  return { ok: true, admin: session };
}
