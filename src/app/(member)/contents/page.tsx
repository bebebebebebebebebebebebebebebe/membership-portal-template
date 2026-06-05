import type { Metadata } from "next";

import { mockContents } from "@/features/contents/data/contents";
import { CategoryFilter } from "@/features/contents/components/category-filter";
import { ContentGrid } from "@/features/contents/components/content-grid";
import { ContentPagination } from "@/features/contents/components/content-pagination";
import { StatCards } from "@/features/contents/components/stat-cards";

export const metadata: Metadata = {
  title: "コンテンツ一覧 | Modular Member Portal",
  description: "記事・資料などのコンテンツ一覧",
};

/**
 * コンテンツ一覧ページ（/contents）。
 *
 * 見出し → 統計カード → フィルタ → カードグリッド → ページネーション を縦に積む。
 * 認証/DB 未確定のため、データはすべて contents feature のモックを参照する静的 UI。
 */
export default function ContentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          コンテンツ一覧
        </h1>
        <p className="text-muted-foreground">
          記事・資料をまとめて閲覧できます。
        </p>
      </div>

      <StatCards />

      <CategoryFilter />

      <ContentGrid contents={mockContents} />

      <ContentPagination />
    </div>
  );
}
