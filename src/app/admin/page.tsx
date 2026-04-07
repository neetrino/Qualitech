import type { Metadata } from "next";

import { AdminDashboardClient } from "@/features/admin/admin-dashboard.client";

export const metadata: Metadata = {
  title: "Admin | Qualitech Machinery",
  description: "Qualitech admin sign-in and session.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
