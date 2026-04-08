import type { Metadata } from "next";

import { AdminDashboardClient } from "@/features/admin/admin-dashboard.client";
import { SITE_TAB_TITLE } from "@/lib/site-metadata";

export const metadata: Metadata = {
  title: SITE_TAB_TITLE,
  description: "Qualitech admin sign-in and session.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
