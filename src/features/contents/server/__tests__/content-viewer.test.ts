import { afterEach, describe, expect, it, vi } from "vitest";

import { getContentViewer } from "@/features/contents/server/content-viewer";
import { setTestAuthState } from "@/lib/auth/testing/test-auth-state";
import type { AuthUser } from "@/types/auth";

const freeUser: AuthUser = {
  name: "購入 会員",
  email: "buyer@example.com",
  avatar: "/images/avatars/avatar-02.jpg",
  initials: "購入",
  membership: "無料会員",
  role: "member",
};

describe("getContentViewer", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("test auth state の user と purchasedProductIds を viewer に反映する", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({
      user: freeUser,
      purchasedProductIds: ["product-security-checklist"],
    });

    await expect(getContentViewer()).resolves.toEqual({
      user: freeUser,
      plan: "free",
      purchasedProductIds: ["product-security-checklist"],
    });
  });

  it("未ログイン state は anonymous viewer として返す", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: null, purchasedProductIds: [] });

    await expect(getContentViewer()).resolves.toEqual({
      user: null,
      plan: null,
      purchasedProductIds: [],
    });
  });
});
