import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { logMetaWithRequest } from "@/lib/http/request-log-meta";
import { logger } from "@/lib/logger";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, db: "up" });
  } catch (err) {
    logger.error(
      "health_check_db_failed",
      logMetaWithRequest(request, {
        message: err instanceof Error ? err.message : "unknown",
      }),
    );
    return NextResponse.json({ ok: false, db: "down" }, { status: 503 });
  }
}
