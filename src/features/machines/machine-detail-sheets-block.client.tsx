"use client";

import type { ReactNode } from "react";

import { MachineSheetMobileToggles } from "@/features/machines/machine-sheet-mobile-toggles.client";
import { MachineSheetPanelsProvider } from "@/features/machines/machine-sheet-inline-section.client";
import { MachineSheetExcelSlot, MachineSheetPdfSlot } from "@/features/machines/machine-sheet-panels-slots.client";
import { machineDetailHasSheetPanels } from "@/features/machines/machine-sheet-panels-availability";

type MachineDetailSheetsBlockProps = {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly pdfUrl: string | null | undefined;
  readonly pdfOpenLabel: string;
  readonly pdfCloseLabel: string;
  readonly pdfPanelTitle: string;
  readonly excelUrl: string | null | undefined;
  readonly excelImageUrls: string[];
  readonly excelDownloadLabel: string;
  readonly excelPanelTitle: string;
};

export function MachineDetailSheetsBlock({
  children,
  className,
  pdfUrl,
  pdfOpenLabel,
  pdfCloseLabel,
  pdfPanelTitle,
  excelUrl,
  excelImageUrls,
  excelDownloadLabel,
  excelPanelTitle,
}: MachineDetailSheetsBlockProps) {
  const hasSheetPanels = machineDetailHasSheetPanels({ pdfUrl, excelUrl, excelImageUrls });

  if (!hasSheetPanels) {
    return <div className={className}>{children}</div>;
  }

  return (
    <MachineSheetPanelsProvider
      excelDownloadLabel={excelDownloadLabel}
      excelImageUrls={excelImageUrls}
      excelUrl={excelUrl}
      pdfCloseLabel={pdfCloseLabel}
      pdfOpenLabel={pdfOpenLabel}
      pdfUrl={pdfUrl}
    >
      <div className={className}>
        <MachineSheetMobileToggles />
        <MachineSheetPdfSlot pdfPanelTitle={pdfPanelTitle} pdfUrl={pdfUrl} />
        {children}
        <MachineSheetExcelSlot
          downloadLabel={excelDownloadLabel}
          excelImageUrls={excelImageUrls}
          excelUrl={excelUrl}
          panelTitle={excelPanelTitle}
        />
      </div>
    </MachineSheetPanelsProvider>
  );
}
