"use client";

import { useAdminMessages } from "@/features/admin/admin-messages.context";
import { useAdminTheme } from "@/features/admin/admin-theme.context";
import { adminThemeToggleButtonClass } from "@/features/admin/admin-ui.constants";

function LampIcon() {
  return (
    <svg aria-hidden className="size-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2a7 7 0 00-7 7c0 2.38 1.19 4.47 3 5.74V19a1 1 0 001 1h6a1 1 0 001-1v-4.26c1.81-1.27 3-3.36 3-5.74a7 7 0 00-7-7zm0 2a5 5 0 015 5c0 1.88-1.03 3.51-2.55 4.37L14 17h-4l-.45-3.63A4.98 4.98 0 017 9a5 5 0 015-5zm-1 15h2v2h-2v-2z" />
    </svg>
  );
}

export function AdminThemeToggle() {
  const m = useAdminMessages();
  const { theme, toggleTheme } = useAdminTheme();
  const label = theme === "dark" ? m.theme.toLight : m.theme.toDark;

  return (
    <button
      aria-label={label}
      className={adminThemeToggleButtonClass(theme)}
      onClick={toggleTheme}
      title={label}
      type="button"
    >
      <LampIcon />
    </button>
  );
}
