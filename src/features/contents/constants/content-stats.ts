import {
  FavouriteIcon,
  Files01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

/** 統計カード 1 枚分の値。アイコンは hugeicons の IconSvgElement。 */
export type ContentStat = {
  label: string;
  value: number;
  icon: IconSvgElement;
  /** 装飾色（星のお気に入りのみ amber、他はティールのプライマリ）。 */
  accent: "primary" | "amber";
};

/** コンテンツ一覧ページ上部に表示する統計カードのモック値。 */
export const contentStats: ContentStat[] = [
  { label: "総コンテンツ", value: 248, icon: Files01Icon, accent: "primary" },
  { label: "お気に入り", value: 32, icon: FavouriteIcon, accent: "amber" },
  { label: "今週の新着", value: 18, icon: SparklesIcon, accent: "primary" },
];

/** 件数表示用の総コンテンツ件数。 */
export const totalContentCount = 248;

/** 現在のフィルタ適用後の検索結果件数（モック固定値）。 */
export const resultCount = 24;
