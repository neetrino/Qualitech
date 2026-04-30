"use client";

import { useEffect, useState } from "react";

import { normalizeStoredImageUrl } from "@/lib/image/remote-image-url";

/** Full row width; height = min(85dvh, 960px) — matches Tailwind literal (JIT cannot parse dynamic strings). */
const PDF_VIEWER_FRAME_CLASS =
  "block h-[min(85dvh,960px)] w-full max-w-full border-0 bg-[#18181b]";

type MachinePdfInlinePanelProps = {
  readonly pdfUrl: string | null | undefined;
  readonly pdfLinkLabel: string;
  readonly pdfCloseLabel: string;
};

export function MachinePdfInlinePanel({
  pdfUrl,
  pdfLinkLabel,
  pdfCloseLabel,
}: MachinePdfInlinePanelProps) {
  const trimmed = pdfUrl?.trim() ?? "";
  const src = trimmed.length > 0 ? normalizeStoredImageUrl(trimmed) : "";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [src]);

  if (src.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col gap-3">
      <button
        aria-expanded={open}
        className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#18181b] bg-[#09090b] px-4 py-2.5 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#ff6900] transition hover:border-[#2a2a2f] hover:brightness-110"
        onClick={() => {
          setOpen((v) => !v);
        }}
        type="button"
      >
        {pdfLinkLabel}
      </button>
      {open ? (
        <div className="flex w-full min-w-0 max-w-full flex-col overflow-hidden rounded-2xl border border-[#18181b] bg-[#09090b] shadow-[0_16px_48px_-20px_rgba(0,0,0,0.55)]">
          <div className="flex items-center justify-between gap-3 border-b border-[#18181b] px-3 py-2 sm:px-4">
            <span className="min-w-0 truncate text-[10px] font-bold uppercase tracking-[0.1em] text-[#a1a1aa] sm:text-[11px]">
              {pdfLinkLabel}
            </span>
            <button
              className="shrink-0 rounded-lg border border-[#27272a] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#e4e4e7] transition hover:border-[#ff6900] hover:text-[#ff6900] sm:text-[11px]"
              onClick={() => {
                setOpen(false);
              }}
              type="button"
            >
              {pdfCloseLabel}
            </button>
          </div>
          <iframe
            className={PDF_VIEWER_FRAME_CLASS}
            loading="lazy"
            src={src}
            title={pdfLinkLabel}
          />
        </div>
      ) : null}
    </div>
  );
}
