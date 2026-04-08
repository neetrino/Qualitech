import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bucket = process.env.R2_BUCKET_NAME?.trim() || process.argv[2]?.trim();
if (!bucket) {
  console.error(
    "Missing bucket: set R2_BUCKET_NAME or run: pnpm run r2:cors -- <bucket-name>",
  );
  process.exit(1);
}
const corsFile = path.join(__dirname, "..", "infra", "r2-cors.json");
const r = spawnSync(
  "npx",
  ["--yes", "wrangler@3", "r2", "bucket", "cors", "put", bucket, "--file", corsFile],
  { stdio: "inherit", shell: process.platform === "win32" },
);
process.exit(r.status ?? 1);
