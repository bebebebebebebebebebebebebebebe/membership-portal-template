import { afterEach, describe, expect, it, vi } from "vitest";

import AdminLayout from "@/app/admin/layout";
import { setTestAuthState } from "@/lib/auth/testing/test-auth-state";
import type { AuthUser } from "@/types/auth";

const navigationMocks = vi.hoisted(() => ({
  redirect: vi.fn((href: string) => {
    throw new Error(`redirect:${href}`);
  }),
}));

vi.mock("next/navigation", () => navigationMocks);

const memberUser: AuthUser = {
  name: "一般 会員",
  email: "member@example.com",
  avatar: "/images/avatars/avatar-01.jpg",
  initials: "一般",
  membership: "プレミアム会員",
  role: "member",
};

const adminUser: AuthUser = {
  ...memberUser,
  email: "admin@example.com",
  role: "admin",
};

describe("AdminLayout", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    navigationMocks.redirect.mockClear();
  });

  it("admin user には children を返す", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: adminUser, purchasedProductIds: [] });

    await expect(
      AdminLayout({ children: <div>Admin content</div> })
    ).resolves.toEqual(<div>Admin content</div>);
    expect(navigationMocks.redirect).not.toHaveBeenCalled();
  });

  it("未ログイン user は next 付き login へ redirect する", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: null, purchasedProductIds: [] });

    await expect(
      AdminLayout({ children: <div>Admin content</div> })
    ).rejects.toThrow("redirect:/login?next=%2Fadmin%2Fcontents");
  });

  it("member user は /forbidden へ redirect する", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: memberUser, purchasedProductIds: [] });

    await expect(
      AdminLayout({ children: <div>Admin content</div> })
    ).rejects.toThrow("redirect:/forbidden");
  });
});
