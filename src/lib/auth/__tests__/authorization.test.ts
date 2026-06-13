import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ForbiddenError,
  requireAdmin,
  requireCurrentAdminForRoute,
  requireAuthenticatedUser,
  requireCurrentAdmin,
  requireCurrentUser,
  requireCurrentUserForRoute,
  requireRole,
  UnauthorizedError,
} from "@/lib/auth/authorization";
import { setTestAuthState } from "@/lib/auth/testing/test-auth-state";
import type { AuthUser } from "@/types/auth";

const navigationMocks = vi.hoisted(() => ({
  forbidden: vi.fn(() => {
    throw new Error("forbidden");
  }),
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
  membership: "無料会員",
  role: "member",
};

const adminUser: AuthUser = {
  ...memberUser,
  email: "admin@example.com",
  role: "admin",
};

describe("authorization guards", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    navigationMocks.redirect.mockClear();
    navigationMocks.forbidden.mockClear();
  });

  it("requireAuthenticatedUser は null で UnauthorizedError を投げる", () => {
    expect(() => requireAuthenticatedUser(null)).toThrow(UnauthorizedError);
  });

  it("requireRole は role 不一致で ForbiddenError を投げる", () => {
    expect(() => requireRole(memberUser, "admin")).toThrow(ForbiddenError);
  });

  it("requireAdmin は admin user を返す", () => {
    expect(requireAdmin(adminUser)).toBe(adminUser);
  });

  it("requireCurrentUser は未ログイン時に /login へ redirect する", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: null, purchasedProductIds: [] });

    await expect(requireCurrentUser()).rejects.toThrow("redirect:/login");
    expect(navigationMocks.redirect).toHaveBeenCalledWith("/login");
  });

  it("requireCurrentUser はログイン済み user を返す", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: memberUser, purchasedProductIds: [] });

    await expect(requireCurrentUser()).resolves.toEqual(memberUser);
  });

  it("requireCurrentUserForRoute は未ログイン時に next 付き login へ redirect する", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: null, purchasedProductIds: [] });

    await expect(
      requireCurrentUserForRoute({ nextPath: "/bookmarks" })
    ).rejects.toThrow("redirect:/login?next=%2Fbookmarks");
    expect(navigationMocks.redirect).toHaveBeenCalledWith(
      "/login?next=%2Fbookmarks"
    );
  });

  it("requireCurrentUserForRoute はログイン済み user を返す", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: memberUser, purchasedProductIds: [] });

    await expect(
      requireCurrentUserForRoute({ nextPath: "/dashboard" })
    ).resolves.toEqual(memberUser);
  });

  it("requireCurrentAdmin は非 admin で forbidden にする", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: memberUser, purchasedProductIds: [] });

    await expect(requireCurrentAdmin()).rejects.toThrow("forbidden");
    expect(navigationMocks.forbidden).toHaveBeenCalled();
  });

  it("requireCurrentAdmin は admin user を返す", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: adminUser, purchasedProductIds: [] });

    await expect(requireCurrentAdmin()).resolves.toEqual(adminUser);
  });

  it("requireCurrentAdminForRoute は admin user を返す", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: adminUser, purchasedProductIds: [] });

    await expect(
      requireCurrentAdminForRoute({ nextPath: "/admin/contents" })
    ).resolves.toEqual(adminUser);
    expect(navigationMocks.redirect).not.toHaveBeenCalled();
  });

  it("requireCurrentAdminForRoute は未ログイン時に next 付き login へ redirect する", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: null, purchasedProductIds: [] });

    await expect(
      requireCurrentAdminForRoute({ nextPath: "/admin/contents" })
    ).rejects.toThrow("redirect:/login?next=%2Fadmin%2Fcontents");
    expect(navigationMocks.redirect).toHaveBeenCalledWith(
      "/login?next=%2Fadmin%2Fcontents"
    );
  });

  it("requireCurrentAdminForRoute は非 admin user を /forbidden へ redirect する", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: memberUser, purchasedProductIds: [] });

    await expect(
      requireCurrentAdminForRoute({ nextPath: "/admin/contents" })
    ).rejects.toThrow("redirect:/forbidden");
    expect(navigationMocks.redirect).toHaveBeenCalledWith("/forbidden");
  });
});
