"use client";

import {
  useMachineSheetPanelState,
  useMachineSheetPanels,
} from "@/features/machines/machine-sheet-inline-section.client";
import { MachineSheetToggleButton } from "@/features/machines/machine-sheet-toggle-button";

const MOBILE_SHEET_TOGGLES_ROW_CLASS =
  "flex flex-nowrap items-center gap-2 overflow-x-auto lg:hidden";

export function MachineSheetMobileToggles() {
  const { hasPdf, pdfOpenLabel, pdfCloseLabel } = useMachineSheetPanels();
  const { pdfOpen, setPdfOpen } = useMachineSheetPanelState();

  if (!hasPdf) {
    return null;
  }

  return (
    <div className={MOBILE_SHEET_TOGGLES_ROW_CLASS}>
      <MachineSheetToggleButton
        expanded={pdfOpen}
        label={pdfOpen ? pdfCloseLabel : pdfOpenLabel}
        onClick={() => {
          setPdfOpen(!pdfOpen);
        }}
      />
    </div>
  );
}
