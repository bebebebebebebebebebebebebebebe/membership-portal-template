import type { Metadata } from "next";

import { getContents } from "@/features/contents/api/get-contents";
import { CategoryFilter } from "@/features/contents/components/category-filter";
import { ContentGrid } from "@/features/contents/components/content-grid";
import { ContentPagination } from "@/features/contents/components/content-pagination";

export const metadata: Metadata = {
  title: "コンテンツカタログ | Modular Member Portal",
  description:
    "無料公開・ログイン限定・有料プラン・単品購入のコンテンツを確認できます。",
};

export const dynamic = "force-dynamic";

/**
 * コンテンツカタログページ（公開・/contents）。
 *
 * 非会員も閲覧できる公開カタログ。見出し → フィルタ → カードグリッド →
 * ページネーションを縦に積む。本文の閲覧可否は詳細ページの Content Gate で別途判定するため、
 * ここでは accessPolicy に依存しない一覧表示に徹する。データは API abstraction から取得する。
 */
export default async function ContentsPage() {
  const contents = await getContents();
  const contentGrid = await ContentGrid({ contents });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          コンテンツカタログ
        </h1>
        <p className="text-muted-foreground">
          無料公開・ログイン限定・有料プラン・単品購入のコンテンツをまとめて確認できます。
        </p>
      </div>

      <CategoryFilter />

      {contentGrid}

      <ContentPagination />
    </div>
  );
}
