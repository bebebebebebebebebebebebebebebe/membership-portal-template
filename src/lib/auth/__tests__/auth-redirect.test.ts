import { describe, expect, it } from "vitest";

import {
  createLoginRedirectPath,
  normalizeInternalNextPath,
} from "@/lib/auth/auth-redirect";

describe("auth redirect helpers", () => {
  it("login redirect path に encode 済み next path を付与する", () => {
    expect(createLoginRedirectPath("/settings/profile")).toBe(
      "/login?next=%2Fsettings%2Fprofile"
    );
  });

  it("外部 URL は既定の Member Zone 入口へ正規化する", () => {
    expect(normalizeInternalNextPath("https://evil.example.com")).toBe(
      "/dashboard"
    );
  });

  it("protocol-relative URL は既定の Member Zone 入口へ正規化する", () => {
    expect(normalizeInternalNextPath("//evil.example.com")).toBe("/dashboard");
  });

  it("空の next path は既定の Member Zone 入口へ正規化する", () => {
    expect(normalizeInternalNextPath(undefined)).toBe("/dashboard");
    expect(normalizeInternalNextPath(null)).toBe("/dashboard");
    expect(normalizeInternalNextPath("")).toBe("/dashboard");
  });
});
