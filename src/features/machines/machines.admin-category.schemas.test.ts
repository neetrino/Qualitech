import { describe, expect, it } from "vitest";

import { adminMachineCategoryCreateSchema } from "@/features/machines/machines.admin-category.schemas";

describe("adminMachineCategoryCreateSchema", () => {
  it("accepts SEO description on translations", () => {
    const out = adminMachineCategoryCreateSchema.parse({
      slug: "lathes",
      sortOrder: 0,
      translations: [
        {
          locale: "ru",
          name: "Токарные",
          homeDescription: "Описание",
          homeBullets: ["A"],
          metaDescription: "SEO ru",
          ogImageUrl: "https://cdn.example.com/og.jpg",
        },
        {
          locale: "en",
          name: "Lathes",
          homeDescription: "Copy",
          homeBullets: ["B"],
          metaDescription: "SEO en",
          ogImageUrl: "https://cdn.example.com/og.jpg",
        },
      ],
    });
    expect(out.translations[1]?.metaDescription).toBe("SEO en");
  });
});
