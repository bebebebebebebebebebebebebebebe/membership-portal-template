import { describe, expect, it } from "vitest";

import type { ContentAccessPolicy } from "@/features/contents/types/content-access";
import type { ContentViewer } from "@/features/contents/types/content-viewer";
import type { ProductOffer } from "@/features/contents/types/product-offer";
import {
  getContentActionDisplay,
  getPersonalizedContentActionDisplay,
} from "@/features/contents/utils/content-access-display";
import type { AuthUser } from "@/types/auth";

const policies: Record<string, ContentAccessPolicy> = {
  free: { kind: "free" },
  loginRequired: { kind: "loginRequired" },
  planRequired: { kind: "planRequired", requiredPlans: ["premium"] },
  purchaseRequired: { kind: "purchaseRequired", productId: "product-a" },
  planOrPurchase: {
    kind: "planOrPurchase",
    requiredPlans: ["standard", "premium"],
    productId: "product-a",
  },
};

function makeOffer(price: number): ProductOffer {
  return {
    productId: "product-a",
    price,
    currency: "JPY",
    taxIncluded: true,
    available: true,
  };
}

function makeUser(membership: string, role: AuthUser["role"] = "member"): AuthUser {
  return {
    name: "テストユーザー",
    email: "user@example.com",
    avatar: "/images/avatar.png",
    initials: "TU",
    membership,
    role,
  };
}

const anonymousViewer: ContentViewer = {
  user: null,
  plan: null,
  purchasedProductIds: [],
};

const authenticatedViewer: ContentViewer = {
  user: makeUser("無料会員"),
  plan: "free",
  purchasedProductIds: [],
};

const premiumViewer: ContentViewer = {
  user: makeUser("プレミアム会員"),
  plan: "premium",
  purchasedProductIds: [],
};

const purchasedViewer: ContentViewer = {
  user: makeUser("無料会員"),
  plan: "free",
  purchasedProductIds: ["product-a"],
};

const adminViewer: ContentViewer = {
  user: makeUser("管理者", "admin"),
  plan: null,
  purchasedProductIds: [],
};

describe("getContentActionDisplay", () => {
  it("free は閲覧条件を出さず詳細導線の CTA を返す", () => {
    expect(getContentActionDisplay(policies.free)).toEqual({
      conditionLabel: null,
      actionLabel: "詳細を見る",
    });
  });

  it("loginRequired はログイン前提の閲覧条件と CTA を返す", () => {
    expect(getContentActionDisplay(policies.loginRequired)).toEqual({
      conditionLabel: "無料・ログインで閲覧",
      actionLabel: "ログインして閲覧",
    });
  });

  it("planRequired は有料プランの閲覧条件と CTA を返す", () => {
    expect(getContentActionDisplay(policies.planRequired)).toEqual({
      conditionLabel: "有料プラン加入で閲覧",
      actionLabel: "プランを確認",
    });
  });

  it("purchaseRequired は ProductOffer 価格を閲覧条件に出す", () => {
    expect(
      getContentActionDisplay(policies.purchaseRequired, makeOffer(1980))
    ).toEqual({
      conditionLabel: "1,980円",
      actionLabel: "購入して見る",
    });
  });

  it("planOrPurchase は価格込みの閲覧条件と CTA を返す", () => {
    expect(
      getContentActionDisplay(policies.planOrPurchase, makeOffer(2480))
    ).toEqual({
      conditionLabel: "有料プランまたは2,480円",
      actionLabel: "閲覧方法を確認",
    });
  });

  it("offer 欠落時は購入系を fallback 文言で表示する", () => {
    expect(getContentActionDisplay(policies.purchaseRequired)).toEqual({
      conditionLabel: "購入",
      actionLabel: "購入して見る",
    });
    expect(getContentActionDisplay(policies.planOrPurchase)).toEqual({
      conditionLabel: "有料プランまたは購入",
      actionLabel: "閲覧方法を確認",
    });
  });
});

describe("getPersonalizedContentActionDisplay", () => {
  it("anonymous の loginRequired はログイン条件と CTA を返す", () => {
    expect(
      getPersonalizedContentActionDisplay(
        policies.loginRequired,
        anonymousViewer
      )
    ).toEqual({
      conditionLabel: "無料・ログインで閲覧",
      actionLabel: "ログインして閲覧",
    });
  });

  it("authenticated の loginRequired は条件を隠して詳細導線を返す", () => {
    expect(
      getPersonalizedContentActionDisplay(
        policies.loginRequired,
        authenticatedViewer
      )
    ).toEqual({
      conditionLabel: null,
      actionLabel: "詳細を見る",
    });
  });

  it("required plan に一致する viewer は条件を隠して詳細導線を返す", () => {
    expect(
      getPersonalizedContentActionDisplay(
        policies.planRequired,
        premiumViewer
      )
    ).toEqual({
      conditionLabel: null,
      actionLabel: "詳細を見る",
    });
  });

  it("購入済み viewer は条件を隠して詳細導線を返す", () => {
    expect(
      getPersonalizedContentActionDisplay(
        policies.purchaseRequired,
        purchasedViewer,
        makeOffer(1980)
      )
    ).toEqual({
      conditionLabel: null,
      actionLabel: "詳細を見る",
    });
  });

  it("admin viewer は policy にかかわらず条件を隠して詳細導線を返す", () => {
    expect(
      getPersonalizedContentActionDisplay(
        policies.planOrPurchase,
        adminViewer,
        makeOffer(2480)
      )
    ).toEqual({
      conditionLabel: null,
      actionLabel: "詳細を見る",
    });
  });

  it("権限不足 viewer は policy 由来の条件と CTA を返す", () => {
    expect(
      getPersonalizedContentActionDisplay(
        policies.planOrPurchase,
        authenticatedViewer,
        makeOffer(2480)
      )
    ).toEqual({
      conditionLabel: "有料プランまたは2,480円",
      actionLabel: "閲覧方法を確認",
    });
  });
});
