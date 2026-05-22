import { normalizeStoredImageUrl } from "@/lib/image/remote-image-url";

type MachineSheetPanelsAvailabilityInput = {
  readonly pdfUrl: string | null | undefined;
  readonly excelUrl: string | null | undefined;
  readonly excelImageUrls: string[];
};

export function machineDetailHasSheetPanels({
  pdfUrl,
  excelUrl,
  excelImageUrls,
}: MachineSheetPanelsAvailabilityInput): boolean {
  const pdfTrimmed = pdfUrl?.trim() ?? "";
  const pdfSrc = pdfTrimmed.length > 0 ? normalizeStoredImageUrl(pdfTrimmed) : "";
  const excelTrimmed = excelUrl?.trim() ?? "";
  const hasExcelFile = excelTrimmed.length > 0;
  const hasExcelImages = excelImageUrls.some((url) => normalizeStoredImageUrl(url).trim().length > 0);
  return pdfSrc.length > 0 || hasExcelFile || hasExcelImages;
}
