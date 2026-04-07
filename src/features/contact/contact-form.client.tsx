"use client";

import { useCallback, useState, type FormEvent } from "react";

import { CONTACT_MESSAGE_MAX_LEN, CONTACT_NAME_MAX_LEN, CONTACT_SUBMIT_PATH } from "@/features/contact/contact.constants";
import type { ContactMessages } from "@/features/contact/contact.messages";

const IDEMPOTENCY_HEADER = "idempotency-key";

type ContactFormMessages = ContactMessages["form"];

type ContactApiSuccess = {
  data: { id: string; createdAt: string; replay: boolean };
};

type ContactApiErrorBody = {
  error: { code: string; message: string; details?: Record<string, unknown> };
};

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const RECAPTCHA_SCRIPT_SELECTOR = 'script[src*="google.com/recaptcha/api.js"]';

function loadRecaptchaScript(siteKey: string): Promise<void> {
  if (document.querySelector(RECAPTCHA_SCRIPT_SELECTOR)) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("recaptcha_load_failed"));
    document.head.appendChild(script);
  });
}

async function getRecaptchaToken(siteKey: string): Promise<string> {
  await loadRecaptchaScript(siteKey);
  return new Promise((resolve, reject) => {
    const g = window.grecaptcha;
    if (!g) {
      reject(new Error("recaptcha_missing"));
      return;
    }
    g.ready(() => {
      g.execute(siteKey, { action: "contact" }).then(resolve).catch(reject);
    });
  });
}

type ContactFormClientProps = {
  readonly messages: ContactFormMessages;
};

export function ContactFormClient({ messages }: ContactFormClientProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? "";

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setStatus("sending");
      setErrorText(null);

      let recaptchaToken: string | undefined;
      if (siteKey) {
        try {
          recaptchaToken = await getRecaptchaToken(siteKey);
        } catch {
          setStatus("error");
          setErrorText(messages.errorGeneric);
          return;
        }
      }

      const body: Record<string, string> = {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      };
      if (recaptchaToken) {
        body.recaptchaToken = recaptchaToken;
      }

      try {
        const res = await fetch(CONTACT_SUBMIT_PATH, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            [IDEMPOTENCY_HEADER]: crypto.randomUUID(),
          },
          body: JSON.stringify(body),
        });

        const json: unknown = await res.json();
        if (res.ok) {
          const ok = json as ContactApiSuccess;
          if (ok.data?.id) {
            setStatus("success");
            setName("");
            setEmail("");
            setMessage("");
            return;
          }
        }

        const err = json as ContactApiErrorBody;
        const code = err.error?.code;
        setStatus("error");
        setErrorText(code === "VALIDATION_ERROR" ? messages.errorValidation : messages.errorGeneric);
      } catch {
        setStatus("error");
        setErrorText(messages.errorGeneric);
      }
    },
    [email, message, name, messages.errorGeneric, messages.errorValidation, siteKey],
  );

  if (status === "success") {
    return (
      <p className="text-sm leading-relaxed text-[#9f9fa9]" role="status">
        {messages.success}
      </p>
    );
  }

  return (
    <form className="flex flex-col gap-4" noValidate onSubmit={onSubmit}>
      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#71717b]">{messages.name}</span>
        <input
          autoComplete="name"
          className="rounded-xl border border-[#27272a] bg-[#09090b] px-4 py-3 text-sm text-white outline-none ring-[#ff6900] transition placeholder:text-[#52525c] focus:border-[#ff6900] focus:ring-1"
          maxLength={CONTACT_NAME_MAX_LEN}
          name="name"
          required
          type="text"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#71717b]">{messages.email}</span>
        <input
          autoComplete="email"
          className="rounded-xl border border-[#27272a] bg-[#09090b] px-4 py-3 text-sm text-white outline-none ring-[#ff6900] transition placeholder:text-[#52525c] focus:border-[#ff6900] focus:ring-1"
          name="email"
          required
          type="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#71717b]">{messages.message}</span>
        <textarea
          className="min-h-[120px] resize-y rounded-xl border border-[#27272a] bg-[#09090b] px-4 py-3 text-sm text-white outline-none ring-[#ff6900] transition placeholder:text-[#52525c] focus:border-[#ff6900] focus:ring-1"
          maxLength={CONTACT_MESSAGE_MAX_LEN}
          name="message"
          required
          value={message}
          onChange={(ev) => setMessage(ev.target.value)}
        />
      </label>
      {errorText ? (
        <p className="text-sm text-[#f97316]" role="alert">
          {errorText}
        </p>
      ) : null}
      <button
        className="mt-1 flex h-11 items-center justify-center rounded-full bg-[#ff6900] px-6 text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-[0_8px_14px_rgba(255,105,0,0.28)] transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:text-xs"
        disabled={status === "sending"}
        type="submit"
      >
        {status === "sending" ? messages.sending : messages.submit}
      </button>
    </form>
  );
}
