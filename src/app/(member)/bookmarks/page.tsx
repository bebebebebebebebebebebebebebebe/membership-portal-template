import type { Metadata } from "next";

import { ComingSoonPage } from "@/components/coming-soon-page";

export const metadata: Metadata = {
  title: "お気に入り | Modular Member Portal",
  description: "お気に入り機能は現在準備中です。",
};

/**
 * お気に入り route の Coming Soon ページ。
 */
export default function BookmarksPage() {
  return (
    <ComingSoonPage
      eyebrow="Member Zone"
      title="お気に入り機能は準備中です"
      description="保存した記事・資料を後から見返せる会員向けページになります。"
      plannedItems={[
        "コンテンツカードからの保存・解除",
        "保存済みコンテンツ一覧",
        "カテゴリ・タグによる絞り込み",
        "閲覧条件に応じた CTA 表示",
      ]}
      primaryHref="/contents"
      primaryLabel="コンテンツカタログを見る"
    />
  );
}
