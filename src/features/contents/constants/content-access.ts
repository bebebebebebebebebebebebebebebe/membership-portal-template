import type { ContentAccessKind } from "@/features/contents/types/content-access";

/**
 * コンテンツ閲覧条件の表示ラベル（一覧カードの access badge 用）。
 *
 * ドメイン型に UI 文言を混ぜず、画面や管理 UI の文言変更をこの定数に閉じ込める。
 * 文言は「次に何をすれば閲覧できるか」を短く伝える行動寄りの表現にする。
 */
export const contentAccessLabels: Record<ContentAccessKind, string> = {
  free: "無料公開",
  loginRequired: "無料登録で閲覧",
  planRequired: "プラン対象",
  purchaseRequired: "単品購入",
  planOrPurchase: "プランまたは購入",
};

/**
 * access badge の見た目（Badge variant）。
 *
 * variant を component に直書きせず、kind ごとの強調度をこの定数に閉じ込める。
 * 無料は控えめ（secondary）、ログイン誘導は枠線（outline）、課金・プラン系は強調（default）。
 */
export const contentAccessBadgeVariants: Record<
  ContentAccessKind,
  "default" | "secondary" | "outline"
> = {
  free: "secondary",
  loginRequired: "outline",
  planRequired: "default",
  purchaseRequired: "default",
  planOrPurchase: "default",
};
