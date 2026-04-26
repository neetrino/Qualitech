import { ImageResponse } from "next/og";

import { BrandIconImageResponseMarkup } from "@/lib/brand-icon-image-response-markup";
import { getBrandFramePngDataUrl } from "@/lib/brand-frame-png-data-url";

const FAVICON_PX = 32;

export const size = { width: FAVICON_PX, height: FAVICON_PX };
export const contentType = "image/png";

export default async function Icon() {
  const dataUrl = await getBrandFramePngDataUrl();
  return new ImageResponse(
    <BrandIconImageResponseMarkup canvasSize={FAVICON_PX} dataUrl={dataUrl} />,
    { ...size },
  );
}
