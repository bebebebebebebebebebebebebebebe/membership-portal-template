import type { ProductOffer } from "@/features/contents/types/product-offer";

/** 単品購入 CTA や販売表示で使う静的モックデータ。 */
export const mockProductOffers: Record<string, ProductOffer> = {
  "product-security-checklist": {
    productId: "product-security-checklist",
    price: 1980,
    currency: "JPY",
    taxIncluded: true,
    available: true,
  },
  "product-modern-javascript": {
    productId: "product-modern-javascript",
    price: 2480,
    currency: "JPY",
    taxIncluded: true,
    available: true,
  },
};
