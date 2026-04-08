import type { ContactSubmitResultDto } from "@/features/contact/contact.dto";
import { notifyContactInbox } from "@/features/contact/contact.notify";
import {
  createContactMessage,
  findContactMessageByIdempotencyKey,
} from "@/features/contact/contact.repository";
import { verifyRecaptchaToken } from "@/features/contact/contact.recaptcha";
import type { ContactSubmitBody } from "@/features/contact/contact.schemas";
import { getRequestId } from "@/lib/http/request-log-meta";
import { isPrismaUniqueConstraintError } from "@/lib/prisma-errors";

export type SubmitContactError = {
  status: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type SubmitContactOutcome =
  | { ok: true; data: ContactSubmitResultDto }
  | { ok: false; error: SubmitContactError };

function toDto(row: { id: string; createdAt: Date }, replay: boolean): ContactSubmitResultDto {
  return { id: row.id, createdAt: row.createdAt.toISOString(), replay };
}

export function getClientIpFromRequest(request: Request): string | undefined {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  return realIp ?? undefined;
}

async function runRecaptchaGate(
  body: ContactSubmitBody,
  remoteIp: string | undefined,
): Promise<SubmitContactError | null> {
  if (!process.env.RECAPTCHA_SECRET_KEY?.trim()) {
    return null;
  }
  if (!body.recaptchaToken?.trim()) {
    return {
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Invalid request body",
      details: { fieldErrors: { recaptchaToken: ["Required when reCAPTCHA is enabled"] }, formErrors: [] },
    };
  }
  const ok = await verifyRecaptchaToken(body.recaptchaToken, remoteIp);
  if (!ok) {
    return {
      status: 400,
      code: "SPAM_REJECTED",
      message: "reCAPTCHA verification failed",
    };
  }
  return null;
}

async function persistNewMessage(
  body: ContactSubmitBody,
  idempotencyKey: string | null,
  requestId: string | undefined,
): Promise<ContactSubmitResultDto> {
  try {
    const row = await createContactMessage({
      name: body.name,
      email: body.email,
      message: body.message,
      idempotencyKey,
    });
    void notifyContactInbox({
      name: body.name,
      email: body.email,
      message: body.message,
      messageId: row.id,
      requestId,
    });
    return toDto(row, false);
  } catch (err) {
    if (idempotencyKey && isPrismaUniqueConstraintError(err)) {
      const existing = await findContactMessageByIdempotencyKey(idempotencyKey);
      if (existing) {
        return toDto(existing, true);
      }
    }
    throw err;
  }
}

export async function submitContactMessage(
  request: Request,
  body: ContactSubmitBody,
  idempotencyKey: string | undefined,
): Promise<SubmitContactOutcome> {
  const recaptchaErr = await runRecaptchaGate(body, getClientIpFromRequest(request));
  if (recaptchaErr) {
    return { ok: false, error: recaptchaErr };
  }

  const key = idempotencyKey ?? null;
  const requestId = getRequestId(request);
  if (key) {
    const existing = await findContactMessageByIdempotencyKey(key);
    if (existing) {
      return { ok: true, data: toDto(existing, true) };
    }
  }

  const data = await persistNewMessage(body, key, requestId);
  return { ok: true, data };
}
