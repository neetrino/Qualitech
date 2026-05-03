"use client";

import { useEffect, useState } from "react";

import { normalizeStoredImageUrl } from "@/lib/image/remote-image-url";

const OFFICE_EMBED_PREFIX = "https://view.officeapps.live.com/op/embed.aspx?src=";

/** Full row width; height matches PDF viewer panel. */
const EXCEL_VIEWER_FRAME_CLASS =
  "block h-[min(85dvh,960px)] w-full max-w-full border-0 bg-[#18181b]";

type MachineExcelInlinePanelProps = {
  readonly excelUrl: string | null | undefined;
  readonly panelTitle: string;
  readonly closeLabel: string;
  readonly downloadLabel: string;
};

export function MachineExcelInlinePanel({
  excelUrl,
  panelTitle,
  closeLabel,
  downloadLabel,
}: MachineExcelInlinePanelProps) {
  const trimmed = excelUrl?.trim() ?? "";
  const absoluteSrc =
    trimmed.length > 0 ? `${OFFICE_EMBED_PREFIX}${encodeURIComponent(normalizeStoredImageUrl(trimmed))}` : "";
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(true);
  }, [absoluteSrc]);

  if (absoluteSrc.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-between">
        <button
          aria-expanded={open}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#18181b] bg-[#09090b] px-4 py-2.5 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#ff6900] transition hover:border-[#2a2a2f] hover:brightness-110"
          onClick={() => {
            setOpen((v) => !v);
          }}
          type="button"
        >
          {panelTitle}
        </button>
        <a
          className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#a1a1aa] underline decoration-[#3f3f46] underline-offset-4 transition hover:text-[#ff6900]"
          href={normalizeStoredImageUrl(trimmed)}
          rel="noopener noreferrer"
          target="_blank"
        >
          {downloadLabel}
        </a>
      </div>
      {open ? (
        <div className="flex w-full min-w-0 max-w-full flex-col overflow-hidden rounded-2xl border border-[#18181b] bg-[#09090b] shadow-[0_16px_48px_-20px_rgba(0,0,0,0.55)]">
          <div className="flex items-center justify-between gap-3 border-b border-[#18181b] px-3 py-2 sm:px-4">
            <span className="min-w-0 truncate text-[10px] font-bold uppercase tracking-[0.1em] text-[#a1a1aa] sm:text-[11px]">
              {panelTitle}
            </span>
            <button
              className="shrink-0 rounded-lg border border-[#27272a] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#e4e4e7] transition hover:border-[#ff6900] hover:text-[#ff6900] sm:text-[11px]"
              onClick={() => {
                setOpen(false);
              }}
              type="button"
            >
              {closeLabel}
            </button>
          </div>
          <iframe className={EXCEL_VIEWER_FRAME_CLASS} loading="lazy" src={absoluteSrc} title={panelTitle} />
        </div>
      ) : null}
    </div>
  );
}
