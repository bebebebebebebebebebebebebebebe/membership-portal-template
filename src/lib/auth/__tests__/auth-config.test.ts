import { afterEach, describe, expect, it, vi } from "vitest";

import { getAuthConfig } from "@/lib/auth/auth-config";

describe("getAuthConfig", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("未指定時は mock provider と premium-member scenario を返す", () => {
    vi.stubEnv("AUTH_PROVIDER", undefined);
    vi.stubEnv("MOCK_AUTH_SCENARIO", undefined);

    expect(getAuthConfig()).toEqual({
      provider: "mock",
      mockScenario: "premium-member",
    });
  });

  it("AUTH_PROVIDER と MOCK_AUTH_SCENARIO を検証して返す", () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    vi.stubEnv("MOCK_AUTH_SCENARIO", "anonymous");

    expect(getAuthConfig()).toEqual({
      provider: "test",
      mockScenario: "anonymous",
    });
  });

  it("不正な AUTH_PROVIDER は fallback せず error にする", () => {
    vi.stubEnv("AUTH_PROVIDER", "unknown");

    expect(() => getAuthConfig()).toThrow();
  });

  it("不正な MOCK_AUTH_SCENARIO は fallback せず error にする", () => {
    vi.stubEnv("MOCK_AUTH_SCENARIO", "guest");

    expect(() => getAuthConfig()).toThrow();
  });
});
