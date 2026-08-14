import { afterEach, describe, expect, it } from "vitest";

import { CANONICAL_SITE_ORIGIN, getSiteOrigin } from "@/lib/site-origin";

const originalAppUrl = process.env.APP_URL;
const originalPublicAppUrl = process.env.NEXT_PUBLIC_APP_URL;

afterEach(() => {
  process.env.APP_URL = originalAppUrl;
  process.env.NEXT_PUBLIC_APP_URL = originalPublicAppUrl;
});

describe("getSiteOrigin", () => {
  it("prefers APP_URL origin without a trailing slash", () => {
    process.env.APP_URL = "https://qualitechmachinery.ru/";
    process.env.NEXT_PUBLIC_APP_URL = "https://ignored.example/";
    expect(getSiteOrigin()).toBe("https://qualitechmachinery.ru");
  });

  it("ignores localhost env and uses the canonical public domain", () => {
    process.env.APP_URL = "http://localhost:3000";
    process.env.NEXT_PUBLIC_APP_URL = "http://127.0.0.1:3000";
    expect(getSiteOrigin()).toBe(CANONICAL_SITE_ORIGIN);
  });

  it("uses NEXT_PUBLIC_APP_URL when APP_URL is missing and host is public", () => {
    delete process.env.APP_URL;
    process.env.NEXT_PUBLIC_APP_URL = "https://preview.example.com";
    expect(getSiteOrigin()).toBe("https://preview.example.com");
  });
});
