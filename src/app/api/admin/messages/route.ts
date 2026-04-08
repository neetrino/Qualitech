import { NextResponse } from "next/server";

import { requireAdmin } from "@/features/admin/admin.guard";
import { listContactMessagesForAdmin } from "@/features/contact/contact.admin.service";

export async function GET(request: Request): Promise<NextResponse> {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }
  const data = await listContactMessagesForAdmin();
  return NextResponse.json({ data });
}
