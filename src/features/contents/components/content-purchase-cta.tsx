import Link from "next/link";

import { getProductOffer } from "@/features/contents/api/get-product-offer";
import type { ContentAccessPolicy } from "@/features/contents/types/content-access";
import { formatPrice } from "@/features/contents/utils/content-access-display";
import { Button } from "@/components/ui/button";

/**
 * 単品購入を含む閲覧条件。`purchaseRequired` と `planOrPurchase` だけを受け取り、
 * 価格解決に使う `productId` を必ず持つことを型で保証する。
 */
type PurchasePolicy = Extract<
  ContentAccessPolicy,
  { kind: "purchaseRequired" | "planOrPurchase" }
>;

export type ContentPurchaseCtaProps = {
  policy: PurchasePolicy;
};

/**
 * Content Gate で使う単品購入 CTA。
 *
 * 価格は `accessPolicy` ではなく `getProductOffer()` 経由の `ProductOffer` から導出する
 * （閲覧条件と販売条件の分離。component から mock を直接 import しない）。実決済は未実装で、
 * 将来の checkout route へ差し替えやすいよう `/contents/purchase/[productId]` を指す。
 * オファーが見つからない場合は価格なしの汎用文言にフォールバックする。
 *
 * @param policy 単品購入を含む閲覧条件
 */
export async function ContentPurchaseCta({ policy }: ContentPurchaseCtaProps) {
  const offer = await getProductOffer(policy.productId);
  const priceLabel = offer ? formatPrice(offer) : "購入";

  return (
    <Button asChild>
      <Link href={`/contents/purchase/${policy.productId}`}>
        {priceLabel}で購入する
      </Link>
    </Button>
  );
}
