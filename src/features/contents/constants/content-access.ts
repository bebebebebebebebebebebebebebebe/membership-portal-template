import type { ContentAccessKind } from "@/features/contents/types/content-access";

/**
 * コンテンツ閲覧条件の表示ラベル。
 *
 * ドメイン型に UI 文言を混ぜず、画面や管理 UI の文言変更をこの定数に閉じ込める。
 */
export const contentAccessLabels: Record<ContentAccessKind, string> = {
  free: "無料公開",
  loginRequired: "ログイン限定",
  planRequired: "有料会員限定",
  purchaseRequired: "単品購入",
  planOrPurchase: "会員または購入",
};
