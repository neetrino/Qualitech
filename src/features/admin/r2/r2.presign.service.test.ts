import { describe, expect, it } from "vitest";

import { buildR2PublicObjectUrl } from "@/features/admin/r2/r2.presign.service";

describe("buildR2PublicObjectUrl", () => {
  it("joins base and key without double slashes", () => {
    expect(buildR2PublicObjectUrl("https://cdn.example.com/", "machines/a.jpg")).toBe(
      "https://cdn.example.com/machines/a.jpg",
    );
    expect(buildR2PublicObjectUrl("https://cdn.example.com", "blog/x.png")).toBe(
      "https://cdn.example.com/blog/x.png",
    );
  });
});
