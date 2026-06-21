import { afterEach, describe, expect, it, vi } from "vitest";

import { getServerEnv } from "@/config/server-env";

describe("getServerEnv", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("process env から private env を検証して返す", () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    vi.stubEnv("MOCK_AUTH_SCENARIO", "anonymous");

    expect(getServerEnv()).toEqual({
      AUTH_PROVIDER: "test",
      MOCK_AUTH_SCENARIO: "anonymous",
    });
  });

  it("private env の不正値は throw する", () => {
    vi.stubEnv("AUTH_PROVIDER", "invalid");

    expect(() => getServerEnv()).toThrow();
  });
});
