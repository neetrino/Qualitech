import type { AdminTheme } from "@/features/admin/admin-theme.constants";

export function adminMainSurfaceClass(theme: AdminTheme): string {
  return theme === "light"
    ? "min-h-dvh bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-200 text-zinc-900"
    : "min-h-dvh bg-[linear-gradient(200.76deg,rgb(37_37_37)_14.56%,rgb(0_0_0)_90.79%)] text-white";
}

export function adminInputClass(theme: AdminTheme): string {
  const base =
    "mt-2 w-full rounded-lg px-3 py-2.5 text-sm outline-none ring-[#ff6900] focus:border-[#ff6900]/60 focus:ring-2";
  return theme === "light"
    ? `${base} border border-zinc-300 bg-white text-zinc-900`
    : `${base} border border-white/15 bg-black/60 text-white`;
}

export function adminLabelClass(theme: AdminTheme): string {
  return theme === "light"
    ? "block text-xs font-semibold uppercase tracking-[0.08em] text-zinc-600"
    : "block text-xs font-semibold uppercase tracking-[0.08em] text-[#9f9fa9]";
}

export function adminTextareaClass(theme: AdminTheme): string {
  return `${adminInputClass(theme)} min-h-[120px] font-mono text-xs leading-relaxed`;
}

export function adminButtonPrimaryClass(): string {
  return "rounded-lg bg-[#ff6900] px-4 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-black transition hover:bg-[#ff8533] disabled:opacity-60";
}

export function adminButtonSecondaryClass(theme: AdminTheme): string {
  return theme === "light"
    ? "rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50 disabled:opacity-60"
    : "rounded-lg border border-white/20 px-4 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:border-white/40 hover:bg-white/5 disabled:opacity-60";
}

export function adminButtonDeleteExtraClass(theme: AdminTheme): string {
  return theme === "light"
    ? "border-red-300 text-red-700 hover:border-red-400"
    : "border-red-500/40 text-red-300 hover:border-red-400/60";
}

export function adminCardPanelClass(theme: AdminTheme): string {
  return theme === "light"
    ? "rounded-2xl border border-zinc-200/90 bg-white/95 p-6 shadow-sm backdrop-blur-sm"
    : "rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm";
}

export function adminListItemRowClass(theme: AdminTheme): string {
  const base =
    "flex flex-col gap-3 rounded-xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between";
  return theme === "light"
    ? `${base} border border-zinc-200 bg-white/90`
    : `${base} border border-white/10 bg-black/30`;
}

export function adminListTitleClass(theme: AdminTheme): string {
  return theme === "light"
    ? "truncate text-sm font-semibold text-zinc-900"
    : "truncate text-sm font-semibold text-white";
}

export function adminListMetaClass(theme: AdminTheme): string {
  return theme === "light" ? "mt-0.5 text-xs text-zinc-600" : "mt-0.5 text-xs text-[#9f9fa9]";
}

export function adminFeaturedBadgeClass(theme: AdminTheme): string {
  return theme === "light" ? "text-amber-700" : "text-amber-300";
}

export function adminNavTabClass(theme: AdminTheme, active: boolean): string {
  const base = "w-full rounded-lg px-4 py-3 text-left text-xs font-black uppercase tracking-[0.1em] transition";
  if (active) {
    return `${base} bg-[#ff6900] text-black`;
  }
  return theme === "light"
    ? `${base} border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900`
    : `${base} border border-white/15 bg-black/40 text-[#9f9fa9] hover:border-white/30 hover:text-white`;
}

export function adminHeaderBorderClass(theme: AdminTheme): string {
  return theme === "light" ? "border-b border-zinc-200" : "border-b border-white/10";
}

export function adminSidebarDividerClass(theme: AdminTheme): string {
  return theme === "light"
    ? "border-b border-zinc-200 pb-6 sm:border-b-0 sm:border-r sm:border-zinc-200 sm:pb-0 sm:pr-6 lg:pr-8"
    : "border-b border-white/10 pb-6 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6 lg:pr-8";
}

export function adminEyebrowClass(theme: AdminTheme): string {
  return theme === "light"
    ? "text-[10px] font-black uppercase tracking-[0.18em] text-[#ea580c]"
    : "text-[10px] font-black uppercase tracking-[0.18em] text-[#ff6900]";
}

export function adminPageTitleClass(theme: AdminTheme): string {
  return theme === "light"
    ? "mt-1 font-display text-2xl uppercase tracking-[-0.04em] text-zinc-900"
    : "mt-1 font-display text-2xl uppercase tracking-[-0.04em] text-white";
}

export function adminEmailLineClass(theme: AdminTheme): string {
  return theme === "light" ? "mt-1 text-sm text-zinc-600" : "mt-1 text-sm text-[#9f9fa9]";
}

export function adminSubtleLinkClass(theme: AdminTheme): string {
  return theme === "light"
    ? "text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline"
    : "text-xs font-semibold uppercase tracking-[0.12em] text-[#9f9fa9] underline-offset-4 hover:text-white hover:underline";
}

export function adminBodyMutedClass(theme: AdminTheme): string {
  return theme === "light" ? "text-sm text-zinc-600" : "text-sm text-[#9f9fa9]";
}

export function adminCheckboxLabelClass(theme: AdminTheme): string {
  return theme === "light"
    ? "flex cursor-pointer items-center gap-2 text-sm text-zinc-600"
    : "flex cursor-pointer items-center gap-2 text-sm text-[#9f9fa9]";
}

export function adminCheckboxClass(theme: AdminTheme): string {
  return theme === "light"
    ? "size-4 rounded border-zinc-400 bg-white text-[#ea580c] focus:ring-[#ff6900]"
    : "size-4 rounded border-white/30 bg-black/60 text-[#ff6900] focus:ring-[#ff6900]";
}

export function adminGalleryRowShellClass(theme: AdminTheme): string {
  const base = "flex flex-col gap-2 rounded-lg p-3 sm:flex-row sm:items-end";
  return theme === "light"
    ? `${base} border border-zinc-200 bg-zinc-50/60`
    : `${base} border border-white/10`;
}

export function adminHintTextClass(theme: AdminTheme): string {
  return theme === "light" ? "mt-1 text-[11px] text-zinc-500" : "mt-1 text-[11px] text-[#9f9fa9]";
}

export function adminPanelHeadingClass(theme: AdminTheme): string {
  return theme === "light"
    ? "text-sm font-black uppercase tracking-[0.08em] text-zinc-900"
    : "text-sm font-black uppercase tracking-[0.08em] text-white";
}

export function adminListMetaSeparatorClass(theme: AdminTheme): string {
  return theme === "light" ? "mx-2 text-zinc-300" : "mx-2 text-white/20";
}

export function adminMonoMutedClass(theme: AdminTheme): string {
  return theme === "light"
    ? "mt-2 break-all font-mono text-xs text-zinc-600"
    : "mt-2 break-all font-mono text-xs text-[#9f9fa9]";
}

export function adminThemeToggleButtonClass(theme: AdminTheme): string {
  return theme === "light"
    ? "inline-flex size-10 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
    : "inline-flex size-10 items-center justify-center rounded-lg border border-white/20 bg-black/40 text-[#ff6900] transition hover:border-white/40 hover:bg-white/5";
}

export function adminAuthCardClass(theme: AdminTheme): string {
  return theme === "light"
    ? "rounded-2xl border border-zinc-200 bg-white/95 p-6 shadow-lg shadow-zinc-300/30 backdrop-blur-sm"
    : "rounded-2xl border border-white/10 bg-black/40 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm";
}

export function adminAuthHeadingClass(theme: AdminTheme): string {
  return theme === "light"
    ? "text-sm font-black uppercase tracking-[0.08em] text-zinc-900"
    : "text-sm font-black uppercase tracking-[0.08em] text-white";
}

export function adminFieldsetShellClass(theme: AdminTheme): string {
  return theme === "light"
    ? "space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/40 p-4"
    : "space-y-3 rounded-xl border border-white/10 p-4";
}

export function adminFormSectionTitleClass(theme: AdminTheme): string {
  return theme === "light"
    ? "text-sm font-black uppercase tracking-[0.08em] text-zinc-900"
    : "text-sm font-black uppercase tracking-[0.08em] text-white";
}
