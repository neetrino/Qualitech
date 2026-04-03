import { describe, expect, it } from "vitest";

import { getRequestId, logMetaWithRequest, REQUEST_ID_HEADER } from "@/lib/http/request-log-meta";

describe("request-log-meta", () => {
  it("reads trimmed x-request-id", () => {
    const req = new Request("https://x.test/api", {
      headers: { [REQUEST_ID_HEADER]: "  abc-123  " },
    });
    expect(getRequestId(req)).toBe("abc-123");
  });

  it("logMetaWithRequest adds requestId when present", () => {
    const req = new Request("https://x.test/api", {
      headers: { [REQUEST_ID_HEADER]: "rid-1" },
    });
    expect(logMetaWithRequest(req, { a: 1 })).toEqual({ a: 1, requestId: "rid-1" });
  });
});
