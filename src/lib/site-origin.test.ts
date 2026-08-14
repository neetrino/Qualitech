import { afterEach, describe, expect, it } from "vitest";

import { getSiteOrigin } from "@/lib/site-origin";

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

  it("falls back to NEXT_PUBLIC_APP_URL then localhost", () => {
    delete process.env.APP_URL;
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    expect(getSiteOrigin()).toBe("http://localhost:3000");
    delete process.env.NEXT_PUBLIC_APP_URL;
    expect(getSiteOrigin()).toBe("http://localhost:3000");
  });
});
