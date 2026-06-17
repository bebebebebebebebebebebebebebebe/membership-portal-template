import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { proxy } from "@/proxy";

function makeRequest(pathname: string) {
  return new NextRequest(`https://example.test${pathname}`);
}

describe("proxy", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each([
    ["/dashboard", "https://example.test/login?next=%2Fdashboard"],
    [
      "/settings/profile",
      "https://example.test/login?next=%2Fsettings%2Fprofile",
    ],
    [
      "/contents/member-only-blueprint",
      "https://example.test/login?next=%2Fcontents%2Fmember-only-blueprint",
    ],
  ])("anonymous user の %s を next 付き login へ redirect する", (pathname, location) => {
    vi.stubEnv("AUTH_PROVIDER", "mock");
    vi.stubEnv("MOCK_AUTH_SCENARIO", "anonymous");

    const response = proxy(makeRequest(pathname));

    expect(response.headers.get("location")).toBe(location);
  });

  it.each([
    "/contents",
    "/contents/1",
    "/api/contents",
    "/_next/static/chunks/app.js",
    "/_next/image?url=%2Fimages%2Fsample.png&w=640&q=75",
  ])("%s は Member Guard の redirect 対象にしない", (pathname) => {
    vi.stubEnv("AUTH_PROVIDER", "mock");
    vi.stubEnv("MOCK_AUTH_SCENARIO", "anonymous");

    const response = proxy(makeRequest(pathname));

    expect(response.headers.get("location")).toBeNull();
  });

  it.each(["/bookmarks", "/contents/member-only-blueprint"])(
    "認証済み mock scenario は %s を通過させる",
    (pathname) => {
      vi.stubEnv("AUTH_PROVIDER", "mock");
      vi.stubEnv("MOCK_AUTH_SCENARIO", "premium-member");

      const response = proxy(makeRequest(pathname));

      expect(response.headers.get("location")).toBeNull();
    }
  );
});
