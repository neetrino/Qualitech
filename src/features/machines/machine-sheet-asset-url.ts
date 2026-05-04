import { normalizeStoredImageUrl } from "@/lib/image/remote-image-url";

/**
 * Product "sheet" URLs are stored in `pdfUrl`; new uploads are images, legacy rows may still be PDFs.
 * Detection uses the URL path extension (R2 keys include the file extension).
 */
export function machineSheetUrlIsPdf(url: string): boolean {
  const raw = url.trim();
  if (raw.length === 0) {
    return false;
  }
  try {
    const normalized = normalizeStoredImageUrl(raw);
    const pathname = new URL(normalized).pathname;
    return /\.pdf$/i.test(pathname);
  } catch {
    return /\.pdf$/i.test(raw);
  }
}

/** Adobe PDF open parameter: fit page width (reduces side letterboxing in many embedded viewers). */
const PDF_IFRAME_VIEW_FIT_WIDTH = "view=FitH";

/**
 * Appends a PDF open-parameter fragment so inline viewers prefer horizontal fit.
 * Safe for signed URLs: the fragment is client-only and not part of the request.
 */
export function machineSheetPdfIframeSrc(url: string): string {
  const trimmed = url.trim();
  if (trimmed.length === 0) {
    return trimmed;
  }
  if (trimmed.includes(PDF_IFRAME_VIEW_FIT_WIDTH)) {
    return trimmed;
  }
  const hashIdx = trimmed.indexOf("#");
  if (hashIdx < 0) {
    return `${trimmed}#${PDF_IFRAME_VIEW_FIT_WIDTH}`;
  }
  const afterHash = trimmed.slice(hashIdx + 1);
  if (afterHash.length === 0) {
    return `${trimmed}${PDF_IFRAME_VIEW_FIT_WIDTH}`;
  }
  return `${trimmed}&${PDF_IFRAME_VIEW_FIT_WIDTH}`;
}
