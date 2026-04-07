"use client";

import { useCallback, useState, type FormEvent } from "react";

import { ADMIN_API_AUTH_LOGIN_PATH } from "@/features/admin/admin.constants";
import { adminApiJson } from "@/features/admin/admin-http.client";
import { useAdminMessages } from "@/features/admin/admin-messages.context";
import { useAdminTheme } from "@/features/admin/admin-theme.context";
import {
  adminAuthCardClass,
  adminAuthHeadingClass,
  adminBodyMutedClass,
  adminButtonPrimaryClass,
  adminInputClass,
  adminLabelClass,
} from "@/features/admin/admin-ui.constants";

type AdminSession = { id: string; email: string };

type MeSuccess = { admin: AdminSession };

type AdminAuthClientProps = {
  readonly onSignedIn: (admin: AdminSession) => void;
};

export function AdminAuthClient({ onSignedIn }: AdminAuthClientProps) {
  const m = useAdminMessages();
  const { theme } = useAdminTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const onLogin = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setBusy(true);
      setFormError(null);
      const res = await adminApiJson<MeSuccess>(ADMIN_API_AUTH_LOGIN_PATH, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setPassword("");
        onSignedIn(res.data.admin);
        setBusy(false);
        return;
      }
      const msg =
        res.error.code === "SERVICE_MISCONFIGURED"
          ? m.auth.unavailable
          : res.error.message || m.auth.failed;
      setFormError(msg);
      setBusy(false);
    },
    [email, m.auth.failed, m.auth.unavailable, onSignedIn, password],
  );

  const inC = adminInputClass(theme);
  const lab = adminLabelClass(theme);
  const pri = adminButtonPrimaryClass();

  return (
    <section className={adminAuthCardClass(theme)}>
      <h2 className={adminAuthHeadingClass(theme)}>{m.auth.heading}</h2>
      <p className={`mt-2 ${adminBodyMutedClass(theme)}`}>{m.auth.sessionHint}</p>
      <form className="mt-6 space-y-4" onSubmit={onLogin}>
        <div>
          <label className={lab} htmlFor="admin-email">
            {m.auth.email}
          </label>
          <input
            autoComplete="email"
            className={inC}
            id="admin-email"
            name="email"
            onChange={(ev) => setEmail(ev.target.value)}
            required
            type="email"
            value={email}
          />
        </div>
        <div>
          <label className={lab} htmlFor="admin-password">
            {m.auth.password}
          </label>
          <input
            autoComplete="current-password"
            className={inC}
            id="admin-password"
            name="password"
            onChange={(ev) => setPassword(ev.target.value)}
            required
            type="password"
            value={password}
          />
        </div>
        {formError ? <p className="text-sm text-red-500">{formError}</p> : null}
        <button className={`${pri} w-full`} disabled={busy} type="submit">
          {busy ? m.auth.signingIn : m.auth.signIn}
        </button>
      </form>
    </section>
  );
}
