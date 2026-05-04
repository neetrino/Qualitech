"use client";

import { useEffect, useState } from "react";

import { machineSheetPdfIframeSrc, machineSheetUrlIsPdf } from "@/features/machines/machine-sheet-asset-url";
import { normalizeStoredImageUrl } from "@/lib/image/remote-image-url";

/** Break out of padded product grid so the sheet uses the full viewport width. */
const PDF_PANEL_VIEWPORT_BLEED_CLASS =
  "relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2";

/**
 * One full dynamic viewport for the open panel (toolbar + viewer). Viewer uses flex-1 so there is no inner scroll.
 */
const SHEET_PANEL_COLUMN_CLASS =
  "flex h-[100dvh] min-h-0 w-full max-w-full flex-col overflow-hidden rounded-none border-y border-[#18181b] bg-[#09090b] shadow-[0_16px_48px_-20px_rgba(0,0,0,0.55)]";

/** Fills space below the toolbar; clips overflow instead of scrolling. */
const SHEET_VIEWER_BODY_CLASS = "min-h-0 flex-1 overflow-hidden bg-[#18181b]";

const SHEET_IFRAME_CLASS = "block h-full w-full border-0 bg-[#18181b]";

const SHEET_IMAGE_CLASS = "block h-full w-full bg-[#18181b] object-contain object-center";

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
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(true);
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
        <div className={PDF_PANEL_VIEWPORT_BLEED_CLASS}>
          <div className={SHEET_PANEL_COLUMN_CLASS}>
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#18181b] px-3 py-2 sm:px-4">
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
            <div className={SHEET_VIEWER_BODY_CLASS}>
              {machineSheetUrlIsPdf(src) ? (
                <iframe
                  className={SHEET_IFRAME_CLASS}
                  loading="lazy"
                  src={machineSheetPdfIframeSrc(src)}
                  title={pdfLinkLabel}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- arbitrary R2 / CDN URL
                <img
                  alt={pdfLinkLabel}
                  className={SHEET_IMAGE_CLASS}
                  decoding="async"
                  loading="lazy"
                  src={src}
                />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
