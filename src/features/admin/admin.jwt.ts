import * as jose from "jose";

import { ADMIN_JWT_ISSUER } from "@/features/admin/admin.constants";
import { jwtExpiresInToSeconds } from "@/features/admin/admin.session-ttl";

export class AdminJwtMisconfiguredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminJwtMisconfiguredError";
  }
}

const MIN_SECRET_LEN = 32;

export function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret || secret.length < MIN_SECRET_LEN) {
    throw new AdminJwtMisconfiguredError("JWT_SECRET must be set and at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function signAdminAccessToken(
  payload: { sub: string; email: string },
  secretKey: Uint8Array,
): Promise<string> {
  const expiresIn = process.env.JWT_EXPIRES_IN?.trim() ?? "7d";
  return new jose.SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setIssuer(ADMIN_JWT_ISSUER)
    .setExpirationTime(expiresIn)
    .sign(secretKey);
}

export async function verifyAdminAccessToken(
  token: string,
  secretKey: Uint8Array,
): Promise<{ sub: string; email: string } | null> {
  try {
    const { payload } = await jose.jwtVerify(token, secretKey, {
      issuer: ADMIN_JWT_ISSUER,
      algorithms: ["HS256"],
    });
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

export function adminSessionMaxAgeSeconds(): number {
  return jwtExpiresInToSeconds(process.env.JWT_EXPIRES_IN);
}
