import { describe, expect, it } from "vitest";

import type { ContentAccessPolicy } from "@/features/contents/types/content-access";
import type { ProductOffer } from "@/features/contents/types/product-offer";
import {
  getContentAccessDisplay,
  getContentPrimaryActionLabel,
} from "@/features/contents/utils/content-access-display";

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

describe("getContentAccessDisplay", () => {
  it("free は badge も補助文も表示しない", () => {
    expect(getContentAccessDisplay(policies.free)).toEqual({
      badgeLabel: null,
      helpText: null,
    });
  });

  it("loginRequired は無料 badge とログイン誘導の補助文を返す", () => {
    expect(getContentAccessDisplay(policies.loginRequired)).toEqual({
      badgeLabel: "無料",
      helpText: "閲覧するにはログインしてください",
    });
  });

  it("planRequired は有料プラン badge とログイン誘導の補助文を返す", () => {
    expect(getContentAccessDisplay(policies.planRequired)).toEqual({
      badgeLabel: "有料プラン",
      helpText: "閲覧するにはログインしてください",
    });
  });

  it("purchaseRequired は価格 badge を返し補助文は出さない", () => {
    expect(
      getContentAccessDisplay(policies.purchaseRequired, makeOffer(1980))
    ).toEqual({
      badgeLabel: "1,980円",
      helpText: null,
    });
  });

  it("planOrPurchase は価格つき badge と補助文を返す", () => {
    expect(
      getContentAccessDisplay(policies.planOrPurchase, makeOffer(2480))
    ).toEqual({
      badgeLabel: "有料プランまたは2,480円",
      helpText: "対象プラン加入、または2,480円で閲覧できます",
    });
  });

  it("offer 欠落時は購入系を fallback 文言で表示する", () => {
    expect(getContentAccessDisplay(policies.purchaseRequired)).toEqual({
      badgeLabel: "購入",
      helpText: null,
    });
    expect(getContentAccessDisplay(policies.planOrPurchase)).toEqual({
      badgeLabel: "有料プランまたは購入",
      helpText: "対象プラン加入、または単品購入で閲覧できます",
    });
  });
});

describe("getContentPrimaryActionLabel", () => {
  it.each([
    ["free", "詳細を見る"],
    ["loginRequired", "ログインして見る"],
    ["planRequired", "プランを確認"],
    ["purchaseRequired", "購入して見る"],
    ["planOrPurchase", "閲覧方法を確認"],
  ])("%s の CTA 文言を返す", (kind, expected) => {
    expect(getContentPrimaryActionLabel(policies[kind])).toBe(expected);
  });
});
