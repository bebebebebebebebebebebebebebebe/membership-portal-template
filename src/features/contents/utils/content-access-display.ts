import type {
  ContentAccessKind,
  ContentAccessPolicy,
} from "@/features/contents/types/content-access";
import type { ProductOffer } from "@/features/contents/types/product-offer";

/**
 * 一覧カード下部 action footer の表示モデル。
 *
 * `conditionLabel` は「閲覧条件」行に出す短い文言で、補助文は持たない
 * （補助文・viewer 状態に応じた出し分けは詳細ページ/gate の責務）。
 * `free` のように閲覧条件を出さない kind は `null` を取り、その場合 footer は
 * panel を出さず CTA だけを表示する。
 */
export type ContentActionDisplay = {
  conditionLabel: string | null;
  actionLabel: string;
};

/**
 * 販売オファーの価格を日本語表記の金額文字列に整形する。
 *
 * @param offer 価格を持つ販売オファー
 * @returns 例: `1,980円`
 */
export function formatPrice(offer: ProductOffer): string {
  return `${offer.price.toLocaleString("ja-JP")}円`;
}

/**
 * 一覧カード下部 CTA の文言。閲覧条件に応じて次に取るべき行動を示す。
 *
 * category（記事/資料）には依存させず、accessPolicy.kind だけで一元的に決める。
 */
const contentPrimaryActionLabels: Record<ContentAccessKind, string> = {
  free: "詳細を見る",
  loginRequired: "ログインして閲覧",
  planRequired: "プランを確認",
  purchaseRequired: "購入して見る",
  planOrPurchase: "閲覧方法を確認",
};

/**
 * accessPolicy と販売オファーから footer action の表示モデルを導出する。
 *
 * 価格は `accessPolicy` ではなく `ProductOffer` から得る（閲覧条件と販売条件の分離）。
 * 一覧はログイン状態に依存しない viewer 非依存カタログとして扱うため、`planRequired` も
 * 「有料プラン」とだけ示し、プラン加入要否の出し分けは詳細ページ/gate に委ねる。
 * category には依存しない。
 *
 * @param policy 対象コンテンツの閲覧条件
 * @param offer purchaseRequired / planOrPurchase の場合の販売オファー（価格表示に使用）
 * @returns 閲覧条件行の文言（出さないときは `null`）と CTA 文言
 */
export function getContentActionDisplay(
  policy: ContentAccessPolicy,
  offer?: ProductOffer
): ContentActionDisplay {
  switch (policy.kind) {
    case "free":
      return {
        conditionLabel: null,
        actionLabel: contentPrimaryActionLabels.free,
      };

    case "loginRequired":
      return {
        conditionLabel: "無料・ログインで閲覧",
        actionLabel: contentPrimaryActionLabels.loginRequired,
      };

    case "planRequired":
      return {
        conditionLabel: "有料プラン加入で閲覧",
        actionLabel: contentPrimaryActionLabels.planRequired,
      };

    case "purchaseRequired": {
      const priceLabel = offer ? formatPrice(offer) : "購入";

      return {
        conditionLabel: priceLabel,
        actionLabel: contentPrimaryActionLabels.purchaseRequired,
      };
    }

    case "planOrPurchase": {
      const priceLabel = offer ? formatPrice(offer) : "購入";

      return {
        conditionLabel: `有料プランまたは${priceLabel}`,
        actionLabel: contentPrimaryActionLabels.planOrPurchase,
      };
    }
  }
}
