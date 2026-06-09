import type {
  ContentAccessKind,
  ContentAccessPolicy,
} from "@/features/contents/types/content-access";
import type { ProductOffer } from "@/features/contents/types/product-offer";

/**
 * 一覧カードのアクセス表示モデル。
 *
 * badge / 補助文は kind によって出さないケース（free / purchaseRequired の補助文）が
 * あるため、いずれも `null` を許容する。両方 `null` のときは indicator 自体を出さない。
 */
export type ContentAccessDisplay = {
  badgeLabel: string | null;
  helpText: string | null;
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
 * accessPolicy と販売オファーから一覧カードのアクセス表示モデルを導出する。
 *
 * 価格は `accessPolicy` ではなく `ProductOffer` から得る（閲覧条件と販売条件の分離）。
 * 一覧はログイン状態に依存しない viewer 非依存カタログとして扱うため、`planRequired` も
 * 補助文はログイン誘導で統一し、プラン加入要否の出し分けは詳細ページ/gate に委ねる。
 * category（記事/資料）には依存しない。
 *
 * @param policy 対象コンテンツの閲覧条件
 * @param offer purchaseRequired / planOrPurchase の場合の販売オファー（価格表示に使用）
 * @returns badge ラベルと補助文。表示しない要素は `null`
 */
export function getContentAccessDisplay(
  policy: ContentAccessPolicy,
  offer?: ProductOffer
): ContentAccessDisplay {
  switch (policy.kind) {
    case "free":
      return { badgeLabel: null, helpText: null };

    case "loginRequired":
      return {
        badgeLabel: "無料",
        helpText: "閲覧するにはログインしてください",
      };

    case "planRequired":
      return {
        badgeLabel: "有料プラン",
        helpText: "閲覧するにはログインしてください",
      };

    case "purchaseRequired": {
      const priceLabel = offer ? formatPrice(offer) : null;

      return {
        badgeLabel: priceLabel ?? "購入",
        helpText: null,
      };
    }

    case "planOrPurchase": {
      const priceLabel = offer ? formatPrice(offer) : null;

      return {
        badgeLabel: priceLabel
          ? `有料プランまたは${priceLabel}`
          : "有料プランまたは購入",
        helpText: priceLabel
          ? `対象プラン加入、または${priceLabel}で閲覧できます`
          : "対象プラン加入、または単品購入で閲覧できます",
      };
    }
  }
}

/**
 * 一覧カード下部 CTA の文言。閲覧条件に応じて次に取るべき行動を示す。
 *
 * category には依存させず、accessPolicy.kind だけで一元的に決める。
 */
const contentPrimaryActionLabels: Record<ContentAccessKind, string> = {
  free: "詳細を見る",
  loginRequired: "ログインして見る",
  planRequired: "プランを確認",
  purchaseRequired: "購入して見る",
  planOrPurchase: "閲覧方法を確認",
};

/**
 * accessPolicy から一覧カード CTA の文言を導出する。
 *
 * @param policy 対象コンテンツの閲覧条件
 * @returns 次に取るべき行動を示す CTA 文言
 */
export function getContentPrimaryActionLabel(
  policy: ContentAccessPolicy
): string {
  return contentPrimaryActionLabels[policy.kind];
}
