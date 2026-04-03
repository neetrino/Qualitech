import { logger } from "@/lib/logger";

const RESEND_API_URL = "https://api.resend.com/emails";

type ResendPayload = {
  from: string;
  to: string[];
  subject: string;
  text: string;
};

async function postResend(apiKey: string, payload: ResendPayload): Promise<void> {
  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
}

/**
 * Best-effort inbox notification. DB persistence is authoritative; failures are logged only.
 */
export async function notifyContactInbox(params: {
  name: string;
  email: string;
  message: string;
  messageId: string;
  requestId?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const toRaw = process.env.CONTACT_INBOX_EMAIL?.trim();
  if (!apiKey || !from || !toRaw) {
    logger.debug("contact_notify_skipped", { reason: "missing_resend_or_inbox_env" });
    return;
  }

  const text = [
    `New contact message (id: ${params.messageId})`,
    `From: ${params.name} <${params.email}>`,
    "",
    params.message,
  ].join("\n");

  try {
    await postResend(apiKey, {
      from,
      to: [toRaw],
      subject: `[Qualitech contact] ${params.name}`,
      text,
    });
  } catch (err) {
    logger.error("contact_resend_failed", {
      messageId: params.messageId,
      detail: err instanceof Error ? err.message : "unknown",
      ...(params.requestId !== undefined ? { requestId: params.requestId } : {}),
    });
  }
}
