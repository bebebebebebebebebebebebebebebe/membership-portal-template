import { afterEach, describe, expect, it, vi } from "vitest";

import { getProxyEnv } from "@/config/proxy-env";

describe("getProxyEnv", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("process env から Proxy 用 private env を検証して返す", () => {
    vi.stubEnv("AUTH_PROVIDER", "mock");
    vi.stubEnv("MOCK_AUTH_SCENARIO", "purchased-member");

    expect(getProxyEnv()).toEqual({
      AUTH_PROVIDER: "mock",
      MOCK_AUTH_SCENARIO: "purchased-member",
    });
  });

  it("Proxy 用 private env の不正値は throw する", () => {
    vi.stubEnv("MOCK_AUTH_SCENARIO", "guest");

    expect(() => getProxyEnv()).toThrow();
  });
});
