import { describe, expect, it } from "vitest";

import { isMemberProtectedRoute } from "@/lib/auth/protected-routes";

describe("isMemberProtectedRoute", () => {
  it.each(["/dashboard", "/bookmarks", "/notifications", "/settings/profile"])(
    "%s を Member Zone の保護対象として扱う",
    (pathname) => {
      expect(isMemberProtectedRoute(pathname)).toBe(true);
    }
  );

  it.each(["/contents", "/contents/1", "/api/contents", "/login"])(
    "%s を Member Zone の保護対象にしない",
    (pathname) => {
      expect(isMemberProtectedRoute(pathname)).toBe(false);
    }
  );

  it("/contents/member-only-blueprint を content route access により保護対象にする", () => {
    expect(isMemberProtectedRoute("/contents/member-only-blueprint")).toBe(
      true
    );
  });
});
