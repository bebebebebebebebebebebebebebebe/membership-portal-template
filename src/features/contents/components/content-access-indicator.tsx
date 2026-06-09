import { getProductOffer } from "@/features/contents/api/get-product-offer";
import { ContentAccessBadge } from "@/features/contents/components/content-access-badge";
import type { Content } from "@/features/contents/types/content";
import { getContentAccessDisplay } from "@/features/contents/utils/content-access-display";

/**
 * access indicator の入力。
 *
 * policy だけでなく content 全体を受け取るのは、productId / requiredPlans / title などを
 * 使った補足表示へ拡張しやすくするため。Milestone 4 では category 分岐はしない。
 *
 * @param content 表示対象コンテンツ
 */
export type ContentAccessIndicatorProps = {
  content: Content;
};

/**
 * accessPolicy から販売オファー解決に使う productId を取り出す。
 *
 * 価格表示が必要なのは単品購入を含む kind だけなので、それ以外は `null` を返す。
 */
function getProductIdForAccess(policy: Content["accessPolicy"]): string | null {
  switch (policy.kind) {
    case "purchaseRequired":
    case "planOrPurchase":
      return policy.productId;
    default:
      return null;
  }
}

/**
 * 一覧カード本文に表示する閲覧条件の表示ブロック。
 *
 * 価格は `accessPolicy` ではなく `getProductOffer()` 経由の `ProductOffer` から導出する。
 * badge / 補助文がどちらも無い（free）場合は余白を残さないよう `null` を返す。
 */
export function ContentAccessIndicator({ content }: ContentAccessIndicatorProps) {
  const productId = getProductIdForAccess(content.accessPolicy);
  const offer = productId ? getProductOffer(productId) : undefined;
  const display = getContentAccessDisplay(content.accessPolicy, offer);

  if (!display.badgeLabel && !display.helpText) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {display.badgeLabel ? (
        <div>
          <ContentAccessBadge label={display.badgeLabel} />
        </div>
      ) : null}

      {display.helpText ? (
        <p className="text-xs text-muted-foreground">{display.helpText}</p>
      ) : null}
    </div>
  );
}
