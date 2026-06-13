import { describe, expect, it } from "vitest";

import { createMockAuthService } from "@/lib/auth/services/mock-auth-service";

describe("createMockAuthService", () => {
  it("anonymous scenario は未ログイン状態を返す", async () => {
    const service = createMockAuthService("anonymous");

    await expect(service.getAuthState()).resolves.toEqual({
      user: null,
      purchasedProductIds: [],
    });
  });

  it("free-member scenario は無料会員を返す", async () => {
    const state = await createMockAuthService("free-member").getAuthState();

    expect(state.user).toMatchObject({
      email: "free.member@example.com",
      membership: "無料会員",
      role: "member",
    });
    expect(state.purchasedProductIds).toEqual([]);
  });

  it("standard-member scenario はスタンダード会員を返す", async () => {
    const state = await createMockAuthService("standard-member").getAuthState();

    expect(state.user).toMatchObject({
      email: "standard.member@example.com",
      membership: "スタンダード会員",
      role: "member",
    });
  });

  it("premium-member scenario はプレミアム会員を返す", async () => {
    const state = await createMockAuthService("premium-member").getAuthState();

    expect(state.user).toMatchObject({
      email: "taro.yamada@example.com",
      membership: "プレミアム会員",
      role: "member",
    });
  });

  it("admin scenario は admin role のユーザーを返す", async () => {
    const state = await createMockAuthService("admin").getAuthState();

    expect(state.user).toMatchObject({
      email: "admin@example.com",
      membership: "プレミアム会員",
      role: "admin",
    });
  });

  it("purchased-member scenario は購入済み productId を返す", async () => {
    const state = await createMockAuthService("purchased-member").getAuthState();

    expect(state.user).toMatchObject({
      membership: "無料会員",
      role: "member",
    });
    expect(state.purchasedProductIds).toEqual([
      "product-security-checklist",
      "product-modern-javascript",
    ]);
  });
});
