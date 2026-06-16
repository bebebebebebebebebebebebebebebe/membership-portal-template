import { describe, expect, it } from "vitest";

import { canAccessContentRoute } from "@/features/contents/utils/content-route-access";
import type { AuthUser } from "@/types/auth";

const memberUser: AuthUser = {
  name: "一般 会員",
  email: "member@example.com",
  avatar: "/images/avatars/avatar-01.jpg",
  initials: "一般",
  membership: "無料会員",
  role: "member",
};

describe("canAccessContentRoute", () => {
  it("public route は anonymous user を許可する", () => {
    expect(canAccessContentRoute({ kind: "public" }, null)).toEqual({
      allowed: true,
      reason: "public",
    });
  });

  it("loginRequired route は anonymous user を拒否する", () => {
    expect(canAccessContentRoute({ kind: "loginRequired" }, null)).toEqual({
      allowed: false,
      reason: "loginRequired",
    });
  });

  it("loginRequired route は authenticated user を許可する", () => {
    expect(
      canAccessContentRoute({ kind: "loginRequired" }, memberUser)
    ).toEqual({
      allowed: true,
      reason: "authenticated",
    });
  });
});
