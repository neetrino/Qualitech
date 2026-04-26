import { ImageResponse } from "next/og";

import { BrandIconImageResponseMarkup } from "@/lib/brand-icon-image-response-markup";
import { getBrandFramePngDataUrl } from "@/lib/brand-frame-png-data-url";

const APPLE_TOUCH_PX = 180;

export const size = { width: APPLE_TOUCH_PX, height: APPLE_TOUCH_PX };
export const contentType = "image/png";

export default async function AppleIcon() {
  const dataUrl = await getBrandFramePngDataUrl();
  return new ImageResponse(
    <BrandIconImageResponseMarkup canvasSize={APPLE_TOUCH_PX} dataUrl={dataUrl} />,
    { ...size },
  );
}
