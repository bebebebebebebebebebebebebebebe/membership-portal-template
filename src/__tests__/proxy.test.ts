import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { proxy } from "../../proxy";

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

  it("認証済み mock scenario は Member Zone を通過させる", () => {
    vi.stubEnv("AUTH_PROVIDER", "mock");
    vi.stubEnv("MOCK_AUTH_SCENARIO", "premium-member");

    const response = proxy(makeRequest("/bookmarks"));

    expect(response.headers.get("location")).toBeNull();
  });
});
