"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { normalizeStoredImageUrl } from "@/lib/image/remote-image-url";

type MachineSheetPanelsContextValue = {
  readonly pdfOpen: boolean;
  readonly setPdfOpen: (open: boolean) => void;
  readonly hasPdf: boolean;
  readonly hasExcel: boolean;
  readonly hasExcelFile: boolean;
  readonly pdfOpenLabel: string;
  readonly pdfCloseLabel: string;
  readonly excelDownloadLabel: string;
  readonly excelDownloadHref: string;
};

const MachineSheetPanelsContext = createContext<MachineSheetPanelsContextValue | null>(null);

export function useMachineSheetPanels(): MachineSheetPanelsContextValue {
  const value = useContext(MachineSheetPanelsContext);
  if (value === null) {
    throw new Error("MachineSheetPanels components must be used within MachineSheetPanelsProvider");
  }
  return value;
}

type MachineSheetPanelsProviderProps = {
  readonly children: ReactNode;
  readonly pdfUrl: string | null | undefined;
  readonly pdfOpenLabel: string;
  readonly pdfCloseLabel: string;
  readonly excelUrl: string | null | undefined;
  readonly excelImageUrls: string[];
  readonly excelDownloadLabel: string;
};

export function MachineSheetPanelsProvider({
  children,
  pdfUrl,
  pdfOpenLabel,
  pdfCloseLabel,
  excelUrl,
  excelImageUrls,
  excelDownloadLabel,
}: MachineSheetPanelsProviderProps) {
  const pdfTrimmed = pdfUrl?.trim() ?? "";
  const pdfSrc = pdfTrimmed.length > 0 ? normalizeStoredImageUrl(pdfTrimmed) : "";
  const excelTrimmed = excelUrl?.trim() ?? "";
  const hasPdf = pdfSrc.length > 0;
  const hasExcelFile = excelTrimmed.length > 0;
  const hasExcelImages = excelImageUrls.some((url) => normalizeStoredImageUrl(url).trim().length > 0);
  const hasExcel = hasExcelFile || hasExcelImages;

  const [pdfOpen, setPdfOpen] = useState(true);

  useEffect(() => {
    setPdfOpen(true);
  }, [pdfSrc]);

  const value = useMemo<MachineSheetPanelsContextValue>(
    () => ({
      pdfOpen,
      setPdfOpen,
      hasPdf,
      hasExcel,
      hasExcelFile,
      pdfOpenLabel,
      pdfCloseLabel,
      excelDownloadLabel,
      excelDownloadHref: hasExcelFile ? normalizeStoredImageUrl(excelTrimmed) : "",
    }),
    [pdfOpen, hasPdf, hasExcel, hasExcelFile, pdfOpenLabel, pdfCloseLabel, excelDownloadLabel, excelTrimmed],
  );

  if (!hasPdf && !hasExcel) {
    return children;
  }

  return <MachineSheetPanelsContext.Provider value={value}>{children}</MachineSheetPanelsContext.Provider>;
}

export function useMachineSheetPanelState(): Pick<MachineSheetPanelsContextValue, "pdfOpen" | "setPdfOpen"> {
  const { pdfOpen, setPdfOpen } = useMachineSheetPanels();
  return { pdfOpen, setPdfOpen };
}
