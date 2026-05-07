"use client";

import { useEffect, useState } from "react";

import { normalizeStoredImageUrl } from "@/lib/image/remote-image-url";

const OFFICE_EMBED_PREFIX = "https://view.officeapps.live.com/op/embed.aspx?src=";

/** Full row width; height matches PDF viewer panel. */
const EXCEL_VIEWER_FRAME_CLASS =
  "block h-[min(85dvh,960px)] w-full max-w-full border-0 bg-[#18181b]";
const EXCEL_PANEL_VIEWPORT_BLEED_CLASS =
  "relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2";

type MachineExcelInlinePanelProps = {
  readonly excelUrl: string | null | undefined;
  readonly excelImageUrls: string[];
  readonly panelTitle: string;
  readonly closeLabel: string;
  readonly downloadLabel: string;
};

export function MachineExcelInlinePanel({
  excelUrl,
  excelImageUrls,
  panelTitle,
  closeLabel,
  downloadLabel,
}: MachineExcelInlinePanelProps) {
  const trimmed = excelUrl?.trim() ?? "";
  const absoluteSrc =
    trimmed.length > 0 ? `${OFFICE_EMBED_PREFIX}${encodeURIComponent(normalizeStoredImageUrl(trimmed))}` : "";
  const normalizedImages = excelImageUrls
    .map((url) => normalizeStoredImageUrl(url).trim())
    .filter((url) => url.length > 0);
  const excelImagesKey = normalizedImages.join("|");
  const hasExcelFile = absoluteSrc.length > 0;
  const hasExcelImages = normalizedImages.length > 0;
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(true);
  }, [absoluteSrc, excelImagesKey]);

  if (!hasExcelFile && !hasExcelImages) {
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
        {hasExcelFile ? (
          <a
            className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#a1a1aa] underline decoration-[#3f3f46] underline-offset-4 transition hover:text-[#ff6900]"
            href={normalizeStoredImageUrl(trimmed)}
            rel="noopener noreferrer"
            target="_blank"
          >
            {downloadLabel}
          </a>
        ) : null}
      </div>
      {open ? (
        <div className={EXCEL_PANEL_VIEWPORT_BLEED_CLASS}>
          <div className="mx-4 flex w-auto min-w-0 max-w-full flex-col overflow-hidden rounded-none border-y border-[#18181b] bg-[#09090b] shadow-[0_16px_48px_-20px_rgba(0,0,0,0.55)] sm:mx-8 lg:mx-12 xl:mx-16">
            <div className="flex items-center justify-end gap-3 border-b border-[#18181b] px-3 py-2 sm:px-4">
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
            {hasExcelFile ? (
              <iframe className={EXCEL_VIEWER_FRAME_CLASS} loading="lazy" src={absoluteSrc} title={panelTitle} />
            ) : (
              <div className="flex flex-col gap-2">
                {normalizedImages.map((url, idx) => (
                  <a className="block w-full" href={url} key={`${url}-${idx}`} rel="noopener noreferrer" target="_blank">
                    {/* eslint-disable-next-line @next/next/no-img-element -- Product specs media from R2/CDN */}
                    <img alt="" className="block w-full" loading="lazy" src={url} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
