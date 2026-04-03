import { RECAPTCHA_MIN_SCORE } from "@/features/contact/contact.constants";
import { logger } from "@/lib/logger";

type SiteVerifyResponse = {
  success?: boolean;
  score?: number;
  "error-codes"?: string[];
};

export async function verifyRecaptchaToken(
  token: string,
  remoteIp: string | undefined,
): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return true;
  }

  const params = new URLSearchParams();
  params.set("secret", secret);
  params.set("response", token);
  if (remoteIp) {
    params.set("remoteip", remoteIp);
  }

  let data: SiteVerifyResponse;
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    data = (await res.json()) as SiteVerifyResponse;
  } catch (err) {
    logger.error("recaptcha_verify_request_failed", {
      message: err instanceof Error ? err.message : "unknown",
    });
    return false;
  }

  if (!data.success) {
    logger.warn("recaptcha_verify_rejected", { errors: data["error-codes"] });
    return false;
  }

  if (typeof data.score === "number" && data.score < RECAPTCHA_MIN_SCORE) {
    logger.warn("recaptcha_score_low", { score: data.score });
    return false;
  }

  return true;
}
