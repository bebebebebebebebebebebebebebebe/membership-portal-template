import { afterEach, describe, expect, it, vi } from "vitest";

import { getPublicEnv } from "@/config/public-env";

describe("getPublicEnv", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("未指定時は public env の default を返す", () => {
    vi.stubEnv("NEXT_PUBLIC_API_MOCKING", undefined);
    vi.stubEnv("NEXT_PUBLIC_BROWSER_AUTH_SCENARIO", undefined);

    expect(getPublicEnv()).toEqual({
      NEXT_PUBLIC_API_MOCKING: "disabled",
      NEXT_PUBLIC_BROWSER_AUTH_SCENARIO: "premium-member",
    });
  });

  it("process env から public env を検証して返す", () => {
    vi.stubEnv("NEXT_PUBLIC_API_MOCKING", "enabled");
    vi.stubEnv("NEXT_PUBLIC_BROWSER_AUTH_SCENARIO", "admin");

    expect(getPublicEnv()).toEqual({
      NEXT_PUBLIC_API_MOCKING: "enabled",
      NEXT_PUBLIC_BROWSER_AUTH_SCENARIO: "admin",
    });
  });

  it("public env の不正値は throw する", () => {
    vi.stubEnv("NEXT_PUBLIC_BROWSER_AUTH_SCENARIO", "guest");

    expect(() => getPublicEnv()).toThrow();
  });

  it("旧 browser scenario env は参照しない", () => {
    const legacyScenarioEnvName = `NEXT_PUBLIC_${"AUTH_MOCK_SCENARIO"}`;

    vi.stubEnv(legacyScenarioEnvName, "admin");
    vi.stubEnv("NEXT_PUBLIC_BROWSER_AUTH_SCENARIO", undefined);

    expect(getPublicEnv().NEXT_PUBLIC_BROWSER_AUTH_SCENARIO).toBe(
      "premium-member"
    );
  });
});
