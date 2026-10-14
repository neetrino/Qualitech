import { describe, expect, it } from "vitest";

import {
  normalizeMachineSlugForAdminStorage,
  normalizeSlugWhileTyping,
} from "@/lib/slug/normalize-machine-slug-for-admin";
import { URL_SLUG_PATTERN } from "@/lib/slug/slug-transliteration.constants";

describe("normalizeMachineSlugForAdminStorage", () => {
  it.each([
    ["Станок ЧПУ 3000", "stanok-chpu-3000"],
    ["Հաստոց 5", "hastots-5"],
    ["Laser/Cutter #1?", "laser-cutter-1"],
    ["  Über   Machine.v2, new  ", "uber-machine-v2-new"],
    ["stanok%20chpu", "stanok-chpu"],
    ["100%", "100"],
    ["--a__b--", "a-b"],
    ["UPPER_case", "upper-case"],
  ])("normalizes %j to %j", (input, expected) => {
    const out = normalizeMachineSlugForAdminStorage(input);
    expect(out).toBe(expected);
    expect(out).toMatch(URL_SLUG_PATTERN);
  });

  it("returns empty string when nothing Latin-convertible remains", () => {
    expect(normalizeMachineSlugForAdminStorage("!!! ???")).toBe("");
  });
});

describe("normalizeSlugWhileTyping", () => {
  it("keeps a single trailing hyphen so words can be separated", () => {
    expect(normalizeSlugWhileTyping("laser ")).toBe("laser-");
    expect(normalizeSlugWhileTyping("laser-")).toBe("laser-");
    expect(normalizeSlugWhileTyping("laser-c")).toBe("laser-c");
  });
});
