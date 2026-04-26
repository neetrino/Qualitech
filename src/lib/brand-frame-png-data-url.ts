import { readFile } from "node:fs/promises";
import { join } from "node:path";

const PUBLIC_HOME_FRAME_PNG = ["public", "home", "Frame 77.png"] as const;

/** Base64 data URL for the Qualitech mark (source file in `public/home/`). */
export async function getBrandFramePngDataUrl(): Promise<string> {
  const filePath = join(process.cwd(), ...PUBLIC_HOME_FRAME_PNG);
  const buf = await readFile(filePath);
  return `data:image/png;base64,${buf.toString("base64")}`;
}
