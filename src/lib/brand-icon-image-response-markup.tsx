type BrandIconImageResponseMarkupProps = {
  canvasSize: number;
  dataUrl: string;
};

const BACKGROUND = "#ffffff";
/** Corner radius as a fraction of canvas — reads as a soft rounded app icon in tabs. */
const BORDER_RADIUS_RATIO = 0.22;
/** Minimal inset so the mark fills the tile and reads larger / less “muddy”. */
const INSET_RATIO = 0.04;

/**
 * Markup for `next/og` `ImageResponse` favicons (Satori-compatible inline styles only).
 */
export function BrandIconImageResponseMarkup({
  canvasSize,
  dataUrl,
}: BrandIconImageResponseMarkupProps) {
  const borderRadius = Math.round(canvasSize * BORDER_RADIUS_RATIO);
  const inset = Math.max(1, Math.round(canvasSize * INSET_RATIO));
  const inner = canvasSize - inset * 2;

  return (
    <div
      style={{
        width: canvasSize,
        height: canvasSize,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BACKGROUND,
        borderRadius,
        overflow: "hidden",
      }}
    >
      <img
        alt=""
        height={inner}
        src={dataUrl}
        width={inner}
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}
