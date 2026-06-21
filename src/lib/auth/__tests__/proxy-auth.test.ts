import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { isAuthenticatedByProxy } from "@/lib/auth/proxy-auth";

function makeRequest(cookie?: string) {
  return new NextRequest("https://example.test/dashboard", {
    headers: cookie ? { cookie } : undefined,
  });
}

describe("isAuthenticatedByProxy", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("mock anonymous scenario は未認証として扱う", () => {
    vi.stubEnv("AUTH_PROVIDER", "mock");
    vi.stubEnv("MOCK_AUTH_SCENARIO", "anonymous");

    expect(isAuthenticatedByProxy(makeRequest())).toBe(false);
  });

  it.each([
    "free-member",
    "standard-member",
    "premium-member",
    "admin",
    "purchased-member",
  ])(
    "mock %s scenario は認証済みとして扱う",
    (scenario) => {
      vi.stubEnv("AUTH_PROVIDER", "mock");
      vi.stubEnv("MOCK_AUTH_SCENARIO", scenario);

      expect(isAuthenticatedByProxy(makeRequest())).toBe(true);
    }
  );

  it("test provider は lightweight cookie で認証済みを判定する", () => {
    vi.stubEnv("AUTH_PROVIDER", "test");

    expect(isAuthenticatedByProxy(makeRequest("__test_auth=authenticated"))).toBe(
      true
    );
    expect(isAuthenticatedByProxy(makeRequest())).toBe(false);
  });

  it("real provider は session cookie の有無だけを軽量判定する", () => {
    vi.stubEnv("AUTH_PROVIDER", "real");

    expect(isAuthenticatedByProxy(makeRequest("session=abc"))).toBe(true);
    expect(isAuthenticatedByProxy(makeRequest())).toBe(false);
  });
});
