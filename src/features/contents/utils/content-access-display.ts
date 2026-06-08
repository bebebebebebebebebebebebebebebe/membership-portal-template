import type {
  ContentAccessKind,
  ContentAccessPolicy,
} from "@/features/contents/types/content-access";

/**
 * access badge の補助文。閲覧に必要な条件を一文で説明する。
 *
 * category（記事/資料）には依存させず、accessPolicy.kind だけで一元的に決める。
 */
const contentAccessHelpTexts: Record<ContentAccessKind, string> = {
  free: "今すぐ閲覧できます",
  loginRequired: "ログインすると閲覧できます",
  planRequired: "対象プラン加入で閲覧できます",
  purchaseRequired: "購入すると閲覧できます",
  planOrPurchase: "対象プラン加入、または単品購入で閲覧できます",
};

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
 * accessPolicy から閲覧条件の補助文を導出する。
 *
 * @param policy 対象コンテンツの閲覧条件
 * @returns badge の近くに表示する説明文
 */
export function getContentAccessHelpText(policy: ContentAccessPolicy): string {
  return contentAccessHelpTexts[policy.kind];
}

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
