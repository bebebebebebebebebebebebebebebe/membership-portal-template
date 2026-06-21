import { describe, expect, it } from "vitest";

import {
  authScenarioSchema,
  parsePublicEnv,
  parseServerEnv,
} from "@/config/env";

describe("env contract", () => {
  it("server env は未指定時に mock / premium-member を返す", () => {
    expect(parseServerEnv({})).toEqual({
      AUTH_PROVIDER: "mock",
      MOCK_AUTH_SCENARIO: "premium-member",
    });
  });

  it("server env は許可値を返す", () => {
    expect(
      parseServerEnv({
        AUTH_PROVIDER: "test",
        MOCK_AUTH_SCENARIO: "anonymous",
      })
    ).toEqual({
      AUTH_PROVIDER: "test",
      MOCK_AUTH_SCENARIO: "anonymous",
    });
  });

  it("server env は不正値を throw する", () => {
    expect(() => parseServerEnv({ AUTH_PROVIDER: "unknown" })).toThrow();
    expect(() => parseServerEnv({ MOCK_AUTH_SCENARIO: "guest" })).toThrow();
  });

  it("public env は未指定時に disabled / premium-member を返す", () => {
    expect(parsePublicEnv({})).toEqual({
      NEXT_PUBLIC_API_MOCKING: "disabled",
      NEXT_PUBLIC_BROWSER_AUTH_SCENARIO: "premium-member",
    });
  });

  it("public env は許可値を返す", () => {
    expect(
      parsePublicEnv({
        NEXT_PUBLIC_API_MOCKING: "enabled",
        NEXT_PUBLIC_BROWSER_AUTH_SCENARIO: "admin",
      })
    ).toEqual({
      NEXT_PUBLIC_API_MOCKING: "enabled",
      NEXT_PUBLIC_BROWSER_AUTH_SCENARIO: "admin",
    });
  });

  it("public env は不正値を throw する", () => {
    expect(() =>
      parsePublicEnv({ NEXT_PUBLIC_API_MOCKING: "yes" })
    ).toThrow();
    expect(() =>
      parsePublicEnv({ NEXT_PUBLIC_BROWSER_AUTH_SCENARIO: "guest" })
    ).toThrow();
  });

  it("mock auth scenario の許可値を固定する", () => {
    expect(authScenarioSchema.options).toEqual([
      "anonymous",
      "free-member",
      "standard-member",
      "premium-member",
      "admin",
      "purchased-member",
    ]);
  });
});
