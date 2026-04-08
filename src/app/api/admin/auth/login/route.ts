import { NextResponse } from "next/server";

import { buildAdminSessionSetCookie } from "@/features/admin/admin.cookies";
import { loginAdmin } from "@/features/admin/auth/admin.auth.service";
import { adminLoginBodySchema } from "@/features/admin/auth/admin.auth.schemas";
import { jsonError } from "@/lib/http/api-error";
import { parseJsonBody } from "@/lib/http/parse-json-body";
import { logMetaWithRequest } from "@/lib/http/request-log-meta";
import { logger } from "@/lib/logger";

export async function POST(request: Request): Promise<NextResponse> {
  const parsed = await parseJsonBody(request, adminLoginBodySchema);
  if (!parsed.ok) {
    return parsed.response;
  }

  const outcome = await loginAdmin(parsed.data.email, parsed.data.password);
  if (!outcome.ok) {
    if (outcome.code === "AUTH_MISCONFIGURED") {
      logger.error("admin_login_jwt_misconfigured", logMetaWithRequest(request, {}));
      return jsonError(503, "SERVICE_MISCONFIGURED", "Authentication is not configured");
    }
    return jsonError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  const res = NextResponse.json({ data: { admin: outcome.admin } });
  res.headers.append("Set-Cookie", buildAdminSessionSetCookie(outcome.token, outcome.maxAgeSec));
  return res;
}
