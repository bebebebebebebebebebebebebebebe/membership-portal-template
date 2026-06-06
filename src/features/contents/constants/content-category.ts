import type { ContentCategory } from "@/features/contents/types/content";

/**
 * カテゴリごとの表示メタ。
 *
 * バッジ色は種別を視覚的に区別するための装飾色で、
 * 記事=ティール（プライマリ）/ 資料=ブルーとして扱う。
 */
export const categoryMeta: Record<
  ContentCategory,
  { badgeClass: string; tagClass: string }
> = {
  記事: {
    badgeClass: "bg-primary text-primary-foreground",
    tagClass: "bg-primary/10 text-primary",
  },
  資料: {
    badgeClass: "bg-blue-500 text-white",
    tagClass: "bg-blue-50 text-blue-700",
  },
};

/** フィルタタブに用いる種別の一覧（タブ先頭の「すべて」は UI 側で付与）。 */
export const contentCategories: ContentCategory[] = ["記事", "資料"];
