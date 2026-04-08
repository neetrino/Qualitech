"use client";

import { useCallback, useEffect, useState } from "react";

import { ADMIN_API_AUTH_ME_PATH } from "@/features/admin/admin.constants";
import { adminApiJson } from "@/features/admin/admin-http.client";
import { AdminAuthClient } from "@/features/admin/admin-auth.client";
import { AdminThemeProvider, useAdminTheme } from "@/features/admin/admin-theme.context";
import { AdminThemeToggle } from "@/features/admin/admin-theme-toggle.client";
import { useAdminMessages } from "@/features/admin/admin-messages.context";
import { AdminWorkspaceClient } from "@/features/admin/admin-workspace.client";
import { adminBodyMutedClass, adminEyebrowClass, adminMainSurfaceClass, adminPageTitleClass } from "@/features/admin/admin-ui.constants";

type AdminSession = { id: string; email: string };

type MeData = { admin: AdminSession };

type Phase = "checking" | "guest" | "authed";

function AdminDashboardInner() {
  const m = useAdminMessages();
  const { theme } = useAdminTheme();
  const [phase, setPhase] = useState<Phase>("checking");
  const [admin, setAdmin] = useState<AdminSession | null>(null);

  const refreshSession = useCallback(async () => {
    setPhase("checking");
    const res = await adminApiJson<MeData>(ADMIN_API_AUTH_ME_PATH, { method: "GET" });
    if (res.ok) {
      setAdmin(res.data.admin);
      setPhase("authed");
      return;
    }
    setAdmin(null);
    setPhase("guest");
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const onSignedIn = useCallback((session: AdminSession) => {
    setAdmin(session);
    setPhase("authed");
  }, []);

  const onSignedOut = useCallback(() => {
    setAdmin(null);
    setPhase("guest");
  }, []);

  return (
    <main className={adminMainSurfaceClass(theme)}>
      {phase === "checking" ? (
        <div className="mx-auto max-w-lg px-4 py-10">
          <p className={adminBodyMutedClass(theme)}>{m.checkingSession}</p>
        </div>
      ) : null}

      {phase === "guest" ? (
        <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 py-10 sm:px-5 md:px-6">
          <header className="mb-10 flex items-center justify-between gap-4">
            <div>
              <p className={adminEyebrowClass(theme)}>{m.brandEyebrow}</p>
              <h1 className={adminPageTitleClass(theme)}>{m.dashboardTitle}</h1>
            </div>
            <AdminThemeToggle />
          </header>
          <AdminAuthClient onSignedIn={onSignedIn} />
        </div>
      ) : null}

      {phase === "authed" && admin ? <AdminWorkspaceClient admin={admin} onSignedOut={onSignedOut} /> : null}
    </main>
  );
}

export function AdminDashboardClient() {
  return (
    <AdminThemeProvider>
      <AdminDashboardInner />
    </AdminThemeProvider>
  );
}
