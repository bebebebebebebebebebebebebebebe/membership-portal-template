import { describe, expect, it } from "vitest";

import type { ContentAccessPolicy } from "@/features/contents/types/content-access";
import {
  getContentAccessHelpText,
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

describe("getContentAccessHelpText", () => {
  it.each([
    ["free", "今すぐ閲覧できます"],
    ["loginRequired", "ログインすると閲覧できます"],
    ["planRequired", "対象プラン加入で閲覧できます"],
    ["purchaseRequired", "購入すると閲覧できます"],
    ["planOrPurchase", "対象プラン加入、または単品購入で閲覧できます"],
  ])("%s の補助文を返す", (kind, expected) => {
    expect(getContentAccessHelpText(policies[kind])).toBe(expected);
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
