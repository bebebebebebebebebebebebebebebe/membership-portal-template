import type { Metadata } from "next";

import { ComingSoonPage } from "@/components/coming-soon-page";

export const metadata: Metadata = {
  title: "Admin コンテンツ管理 | Modular Member Portal",
  description: "Admin コンテンツ管理は現在準備中です。",
};

/**
 * Admin コンテンツ管理 route の Coming Soon ページ。
 */
export default function AdminContentsPage() {
  return (
    <ComingSoonPage
      eyebrow="Admin Zone"
      title="Admin コンテンツ管理は準備中です"
      description="管理者がコンテンツ本文、公開状態、閲覧条件、販売条件を管理するためのページになります。"
      plannedItems={[
        "コンテンツの作成・編集・削除",
        "公開状態と一覧掲載状態の管理",
        "accessPolicy の設定",
        "ProductOffer と単品購入設定の管理",
      ]}
      primaryHref="/contents"
      primaryLabel="コンテンツカタログを見る"
    />
  );
}
