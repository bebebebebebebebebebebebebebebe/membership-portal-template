import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getBrowserAuthScenario,
  getBrowserMockViewer,
} from "@/testing/mocks/auth-scenario";

describe("browser MSW auth scenario", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("未指定時は premium-member を返す", () => {
    vi.stubEnv("NEXT_PUBLIC_AUTH_MOCK_SCENARIO", undefined);

    expect(getBrowserAuthScenario()).toBe("premium-member");
    expect(getBrowserMockViewer()).toMatchObject({
      plan: "premium",
      purchasedProductIds: [],
    });
  });

  it("anonymous scenario は anonymous viewer を返す", () => {
    vi.stubEnv("NEXT_PUBLIC_AUTH_MOCK_SCENARIO", "anonymous");

    expect(getBrowserMockViewer()).toEqual({
      user: null,
      plan: null,
      purchasedProductIds: [],
    });
  });

  it("admin scenario は admin viewer を返す", () => {
    vi.stubEnv("NEXT_PUBLIC_AUTH_MOCK_SCENARIO", "admin");

    expect(getBrowserMockViewer()).toMatchObject({
      user: {
        email: "admin@example.com",
        role: "admin",
      },
      plan: "premium",
      purchasedProductIds: [],
    });
  });

  it("purchased-member scenario は購入済み productId を返す", () => {
    vi.stubEnv("NEXT_PUBLIC_AUTH_MOCK_SCENARIO", "purchased-member");

    expect(getBrowserMockViewer()).toMatchObject({
      user: {
        membership: "無料会員",
        role: "member",
      },
      plan: "free",
      purchasedProductIds: [
        "product-security-checklist",
        "product-modern-javascript",
      ],
    });
  });

  it("不正な scenario は premium-member に fallback する", () => {
    vi.stubEnv("NEXT_PUBLIC_AUTH_MOCK_SCENARIO", "invalid");

    expect(getBrowserAuthScenario()).toBe("premium-member");
  });
});
