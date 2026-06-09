import { describe, expect, it } from "vitest";

import { getProductOffer } from "@/features/contents/api/get-product-offer";
import { mockContents } from "@/features/contents/data/mock-contents";

/**
 * 価格表示が成立するための前提整合性。
 *
 * 単品購入を含む accessPolicy が参照する productId は、必ず販売オファーに存在する必要がある。
 * 不整合は静的 mock 段階の実装ミスなので、UI ではなくテストで検出する。
 */
describe("mockContents と mockProductOffers の整合性", () => {
  const purchasableProductIds = mockContents.flatMap((content) => {
    const policy = content.accessPolicy;
    if (policy.kind === "purchaseRequired" || policy.kind === "planOrPurchase") {
      return [policy.productId];
    }
    return [];
  });

  it("検証対象の productId が存在する", () => {
    expect(purchasableProductIds.length).toBeGreaterThan(0);
  });

  it.each(purchasableProductIds)(
    "%s は ProductOffer に存在する",
    (productId) => {
      expect(getProductOffer(productId)).toBeDefined();
    }
  );
});
