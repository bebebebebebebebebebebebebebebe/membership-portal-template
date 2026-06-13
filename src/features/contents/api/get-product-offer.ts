import type { ProductOffer } from "@/features/contents/types/product-offer";
import { fetchOptionalJson } from "@/lib/api/fetch-json";

/**
 * productId に対応する販売オファーを取得する。
 *
 * @param productId accessPolicy が参照する販売対象 ID。
 * @returns 価格や販売可否を含む販売情報。存在しない場合は undefined。
 */
export async function getProductOffer(
  productId: string
): Promise<ProductOffer | undefined> {
  return fetchOptionalJson<ProductOffer>(
    `/api/product-offers/${encodeURIComponent(productId)}`
  );
}
