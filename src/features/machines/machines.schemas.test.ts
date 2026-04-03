import { describe, expect, it } from "vitest";

import { machinesListQuerySchema } from "@/features/machines/machines.schemas";

describe("machinesListQuerySchema", () => {
  it("accepts minimal valid query", () => {
    const out = machinesListQuerySchema.parse({
      locale: "ru",
    });
    expect(out.locale).toBe("ru");
    expect(out.page).toBeGreaterThanOrEqual(1);
  });

  it("rejects invalid locale", () => {
    const r = machinesListQuerySchema.safeParse({ locale: "fr" });
    expect(r.success).toBe(false);
  });
});
