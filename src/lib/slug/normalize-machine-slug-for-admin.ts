/**
 * Normalizes product/category slug input in admin: strips accidental URI escapes
 * (e.g. pasted from browser bar) and maps `.` / `,` to `-` so public paths stay stable.
 */
export function normalizeMachineSlugForAdminStorage(raw: string): string {
  let s = raw.trim();
  s = s.replace(/%2e/gi, "-").replace(/%2c/gi, "-");
  s = s.replace(/,/g, "-").replace(/\./g, "-");
  s = s.replace(/-+/g, "-").replace(/^-|-$/g, "");
  return s;
}
