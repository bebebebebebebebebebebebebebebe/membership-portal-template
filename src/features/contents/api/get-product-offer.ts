import { mockProductOffers } from "@/features/contents/data/mock-product-offers";
import type { ProductOffer } from "@/features/contents/types/product-offer";

/**
 * productId に対応する販売オファーを返す。
 *
 * @param productId accessPolicy が参照する販売対象 ID。
 * @returns 価格や販売可否を含む販売情報。存在しない場合は undefined。
 */
export function getProductOffer(productId: string): ProductOffer | undefined {
  return mockProductOffers[productId];
}
