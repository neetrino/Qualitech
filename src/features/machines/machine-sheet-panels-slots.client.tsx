"use client";

import { MachineExcelInlinePanel } from "@/features/machines/machine-excel-inline-panel.client";
import { MachinePdfInlinePanel } from "@/features/machines/machine-pdf-inline-panel.client";
import {
  useMachineSheetPanelState,
  useMachineSheetPanels,
} from "@/features/machines/machine-sheet-inline-section.client";

type MachineSheetPdfSlotProps = {
  readonly pdfUrl: string | null | undefined;
  readonly pdfPanelTitle: string;
};

export function MachineSheetPdfSlot({ pdfUrl, pdfPanelTitle }: MachineSheetPdfSlotProps) {
  const { hasPdf, pdfOpenLabel, pdfCloseLabel } = useMachineSheetPanels();
  const { pdfOpen, setPdfOpen } = useMachineSheetPanelState();

  if (!hasPdf) {
    return null;
  }

  return (
    <MachinePdfInlinePanel
      hideToggle
      onOpenChange={setPdfOpen}
      open={pdfOpen}
      pdfCloseLabel={pdfCloseLabel}
      pdfOpenLabel={pdfOpenLabel}
      pdfPanelTitle={pdfPanelTitle}
      pdfUrl={pdfUrl}
      showToggleFromLg
    />
  );
}

type MachineSheetExcelSlotProps = {
  readonly excelUrl: string | null | undefined;
  readonly excelImageUrls: string[];
  readonly panelTitle: string;
  readonly downloadLabel: string;
};

export function MachineSheetExcelSlot({
  excelUrl,
  excelImageUrls,
  panelTitle,
  downloadLabel,
}: MachineSheetExcelSlotProps) {
  const { hasExcel } = useMachineSheetPanels();

  if (!hasExcel) {
    return null;
  }

  return (
    <MachineExcelInlinePanel
      downloadLabel={downloadLabel}
      excelImageUrls={excelImageUrls}
      excelUrl={excelUrl}
      panelTitle={panelTitle}
    />
  );
}
