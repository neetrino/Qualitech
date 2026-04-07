"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { ADMIN_API_AUTH_LOGOUT_PATH } from "@/features/admin/admin.constants";
import { adminApiJson } from "@/features/admin/admin-http.client";
import { AdminBlogPanelClient } from "@/features/admin/admin-blog-panel.client";
import { AdminMessagesPanelClient } from "@/features/admin/admin-messages-panel.client";
import { AdminMachineCategoriesPanelClient } from "@/features/admin/admin-machine-categories-panel.client";
import { AdminMachinePanelClient } from "@/features/admin/admin-machine-panel.client";
import { useAdminMessages } from "@/features/admin/admin-messages.context";
import { AdminThemeToggle } from "@/features/admin/admin-theme-toggle.client";
import { useAdminTheme } from "@/features/admin/admin-theme.context";
import { AdminUploadSectionClient } from "@/features/admin/admin-upload-section.client";
import {
  adminButtonSecondaryClass,
  adminCardPanelClass,
  adminCodeInlineClass,
  adminEmailLineClass,
  adminEyebrowClass,
  adminHeaderBorderClass,
  adminNavTabClass,
  adminOverviewProseClass,
  adminOverviewStrongClass,
  adminPageTitleClass,
  adminSidebarDividerClass,
  adminSubtleLinkClass,
} from "@/features/admin/admin-ui.constants";

type AdminSession = { id: string; email: string };

type Tab = "overview" | "machineSections" | "blog" | "products" | "messages" | "upload";

type AdminWorkspaceClientProps = {
  readonly admin: AdminSession;
  readonly onSignedOut: () => void;
};

const TAB_ORDER: Tab[] = ["overview", "machineSections", "blog", "products", "messages", "upload"];

const ADMIN_PAGE_GUTTER_X = "px-3 sm:px-4 lg:px-6";

const ADMIN_SIDEBAR_WIDTH = "w-full shrink-0 sm:max-w-[200px] lg:max-w-[220px]";

export function AdminWorkspaceClient({ admin, onSignedOut }: AdminWorkspaceClientProps) {
  const m = useAdminMessages();
  const { theme } = useAdminTheme();
  const [tab, setTab] = useState<Tab>("overview");
  const [busy, setBusy] = useState(false);

  const onLogout = useCallback(async () => {
    setBusy(true);
    await adminApiJson<{ ok: true }>(ADMIN_API_AUTH_LOGOUT_PATH, { method: "POST" });
    setBusy(false);
    onSignedOut();
  }, [onSignedOut]);

  const sec = adminCardPanelClass(theme);
  const prose = adminOverviewProseClass(theme);
  const strong = adminOverviewStrongClass(theme);
  const code = adminCodeInlineClass(theme);

  return (
    <div className="w-full min-w-0 max-w-none py-6 sm:py-8">
      <header
        className={`mb-6 flex w-full flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between ${adminHeaderBorderClass(theme)} ${ADMIN_PAGE_GUTTER_X}`}
      >
        <div>
          <p className={adminEyebrowClass(theme)}>{m.brandEyebrow}</p>
          <h1 className={adminPageTitleClass(theme)}>{m.dashboardTitle}</h1>
          <p className={adminEmailLineClass(theme)}>{admin.email}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <AdminThemeToggle />
          <Link className={adminSubtleLinkClass(theme)} href="/">
            {m.workspace.site}
          </Link>
          <button
            className={adminButtonSecondaryClass(theme)}
            disabled={busy}
            onClick={() => void onLogout()}
            type="button"
          >
            {busy ? m.workspace.signingOut : m.workspace.signOut}
          </button>
        </div>
      </header>

      <div className={`flex flex-col gap-6 pb-8 sm:flex-row sm:items-start sm:gap-8 ${ADMIN_PAGE_GUTTER_X}`}>
        <nav
          aria-label={m.workspace.navAriaLabel}
          className={`flex flex-col gap-1 ${adminSidebarDividerClass(theme)} ${ADMIN_SIDEBAR_WIDTH}`}
        >
          {TAB_ORDER.map((t) => (
            <button
              className={adminNavTabClass(theme, tab === t)}
              key={t}
              onClick={() => setTab(t)}
              type="button"
            >
              {m.workspace.tabs[t]}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1">
          {tab === "overview" ? (
            <section className={sec}>
              <p className={prose}>
                <strong className={strong}>{m.workspace.overview.productsLabel}</strong> {m.workspace.overview.productsBody}{" "}
                <code className={code}>/api/admin/machines</code>.
              </p>
              <p className={`mt-3 ${prose}`}>
                <strong className={strong}>{m.workspace.overview.machineSectionsLabel}</strong>{" "}
                {m.workspace.overview.machineSectionsBody} <code className={code}>/api/admin/machine-categories</code>.
              </p>
              <p className={`mt-3 ${prose}`}>
                <strong className={strong}>{m.workspace.overview.blogLabel}</strong> {m.workspace.overview.blogBody}{" "}
                <code className={code}>/api/admin/blog</code>.
              </p>
              <p className={`mt-3 ${prose}`}>
                <strong className={strong}>{m.workspace.overview.uploadLabel}</strong> {m.workspace.overview.uploadBodyBefore}
                <code className={code}>/api/admin/upload</code>
                {m.workspace.overview.uploadBodyAfter}
              </p>
            </section>
          ) : null}
          {tab === "machineSections" ? <AdminMachineCategoriesPanelClient /> : null}
          {tab === "blog" ? <AdminBlogPanelClient /> : null}
          {tab === "products" ? <AdminMachinePanelClient /> : null}
          {tab === "messages" ? <AdminMessagesPanelClient /> : null}
          {tab === "upload" ? <AdminUploadSectionClient /> : null}
        </div>
      </div>
    </div>
  );
}
