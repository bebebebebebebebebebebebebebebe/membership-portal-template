import { describe, expect, it } from "vitest";

import { getProductOffer } from "@/features/contents/api/get-product-offer";

describe("getProductOffer", () => {
  it("HTTP API 経由で ProductOffer 由来の価格を返す", async () => {
    await expect(getProductOffer("product-security-checklist")).resolves.toMatchObject({
      productId: "product-security-checklist",
      price: 1980,
      currency: "JPY",
      taxIncluded: true,
      available: true,
    });
  });

  it("存在しない productId は undefined を返す", async () => {
    await expect(getProductOffer("missing-product")).resolves.toBeUndefined();
  });
});
