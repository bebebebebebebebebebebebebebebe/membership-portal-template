import { afterEach, describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";

import { getContentDetail } from "@/features/contents/api/get-content-detail";
import { setTestAuthState } from "@/lib/auth/testing/test-auth-state";
import { server } from "@/testing/mocks/server";
import type { AuthUser } from "@/types/auth";

const freeUser: AuthUser = {
  name: "無料 会員",
  email: "free.member@example.com",
  avatar: "/images/avatars/avatar-02.jpg",
  initials: "無料",
  membership: "無料会員",
  role: "member",
};

const premiumUser: AuthUser = {
  name: "山田 太郎",
  email: "taro.yamada@example.com",
  avatar: "/images/avatars/avatar-06.jpg",
  initials: "山田",
  membership: "プレミアム会員",
  role: "member",
};

const adminUser: AuthUser = {
  ...premiumUser,
  email: "admin@example.com",
  role: "admin",
};

describe("getContentDetail", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("記事 id に対して full detail（本文セクション・コメント）を返す", async () => {
    const detail = await getContentDetail("1");

    expect(detail).toBeDefined();
    expect(detail?.sections.length).toBeGreaterThan(0);
    expect(detail?.comments).toBeDefined();
    expect(detail?.summary.body).toBeTruthy();
  });

  it("詳細データを持たない id には undefined を返す", async () => {
    await expect(getContentDetail("does-not-exist")).resolves.toBeUndefined();
  });

  it("閲覧不可の detail API は 403 error として扱う", async () => {
    server.use(
      http.get("*/api/contents/:id/detail", () =>
        HttpResponse.json({ error: "Forbidden" }, { status: 403 })
      )
    );

    await expect(getContentDetail("1")).rejects.toMatchObject({
      status: 403,
    });
  });

  it("anonymous viewer は protected detail API で 403 になる", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: null, purchasedProductIds: [] });

    await expect(getContentDetail("4")).rejects.toMatchObject({
      status: 403,
    });
  });

  it("premium-member viewer は premium planRequired detail を取得できる", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: premiumUser, purchasedProductIds: [] });

    const detail = await getContentDetail("4");

    expect(detail?.summary.body).toContain("クラウドインフラ設計");
  });

  it("purchased-member viewer は購入済み productId の planOrPurchase detail を取得できる", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({
      user: freeUser,
      purchasedProductIds: ["product-modern-javascript"],
    });

    const detail = await getContentDetail("7");

    expect(detail?.summary.body).toContain("モダンJavaScript開発");
  });

  it("admin viewer は protected detail を取得できる", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: adminUser, purchasedProductIds: [] });

    const detail = await getContentDetail("7");

    expect(detail?.summary.body).toContain("モダンJavaScript開発");
  });
});
