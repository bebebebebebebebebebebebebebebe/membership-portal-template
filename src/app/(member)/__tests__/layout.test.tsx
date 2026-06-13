import { afterEach, describe, expect, it, vi } from "vitest";

import MemberLayout from "@/app/(member)/layout";
import { setTestAuthState } from "@/lib/auth/testing/test-auth-state";
import type { AuthUser } from "@/types/auth";

const navigationMocks = vi.hoisted(() => ({
  redirect: vi.fn((href: string) => {
    throw new Error(`redirect:${href}`);
  }),
}));

vi.mock("next/navigation", () => ({
  ...navigationMocks,
  usePathname: () => "/dashboard",
}));

const memberUser: AuthUser = {
  name: "一般 会員",
  email: "member@example.com",
  avatar: "/images/avatars/avatar-01.jpg",
  initials: "一般",
  membership: "無料会員",
  role: "member",
};

describe("MemberLayout", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    navigationMocks.redirect.mockClear();
  });

  it("未ログイン user は next 付き login へ redirect する", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: null, purchasedProductIds: [] });

    await expect(
      MemberLayout({ children: <div>Member content</div> })
    ).rejects.toThrow("redirect:/login?next=%2Fdashboard");
  });

  it("認証済み user には Member shell を返す", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: memberUser, purchasedProductIds: [] });

    await expect(
      MemberLayout({ children: <div>Member content</div> })
    ).resolves.toBeDefined();
    expect(navigationMocks.redirect).not.toHaveBeenCalled();
  });
});
