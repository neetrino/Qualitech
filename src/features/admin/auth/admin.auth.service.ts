import argon2 from "argon2";

import {
  adminSessionMaxAgeSeconds,
  AdminJwtMisconfiguredError,
  getJwtSecretKey,
  signAdminAccessToken,
  verifyAdminAccessToken,
} from "@/features/admin/admin.jwt";
import { readCookieFromRequest } from "@/features/admin/admin.cookies";
import { ADMIN_SESSION_COOKIE_NAME } from "@/features/admin/admin.constants";
import { findAdminUserByEmail, findAdminUserById } from "@/features/admin/auth/admin.auth.repository";

export type AdminSession = { id: string; email: string };

export type AdminLoginOutcome =
  | { ok: true; token: string; maxAgeSec: number; admin: AdminSession }
  | { ok: false; code: "INVALID_CREDENTIALS" | "AUTH_MISCONFIGURED" };

export async function loginAdmin(email: string, password: string): Promise<AdminLoginOutcome> {
  let secretKey: Uint8Array;
  try {
    secretKey = getJwtSecretKey();
  } catch (err) {
    if (err instanceof AdminJwtMisconfiguredError) {
      return { ok: false, code: "AUTH_MISCONFIGURED" };
    }
    throw err;
  }

  const normalizedEmail = email.toLowerCase();
  const user = await findAdminUserByEmail(normalizedEmail);
  if (!user) {
    return { ok: false, code: "INVALID_CREDENTIALS" };
  }

  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid) {
    return { ok: false, code: "INVALID_CREDENTIALS" };
  }

  const token = await signAdminAccessToken(
    { sub: user.id, email: user.email },
    secretKey,
  );
  return {
    ok: true,
    token,
    maxAgeSec: adminSessionMaxAgeSeconds(),
    admin: { id: user.id, email: user.email },
  };
}

export async function getAdminSessionFromRequest(request: Request): Promise<AdminSession | null> {
  let secretKey: Uint8Array;
  try {
    secretKey = getJwtSecretKey();
  } catch {
    return null;
  }

  const raw = readCookieFromRequest(request, ADMIN_SESSION_COOKIE_NAME);
  if (!raw) {
    return null;
  }

  const claims = await verifyAdminAccessToken(raw, secretKey);
  if (!claims) {
    return null;
  }

  const user = await findAdminUserById(claims.sub);
  if (!user || user.email !== claims.email) {
    return null;
  }

  return { id: user.id, email: user.email };
}
