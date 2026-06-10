import type { Metadata } from "next";

import { ComingSoonPage } from "@/components/coming-soon-page";

export const metadata: Metadata = {
  title: "ダッシュボード | Modular Member Portal",
  description: "会員ダッシュボードは現在準備中です。",
};

/**
 * 会員ダッシュボード route の Coming Soon ページ。
 */
export default function DashboardPage() {
  return (
    <ComingSoonPage
      eyebrow="Member Zone"
      title="ダッシュボードは準備中です"
      description="閲覧状況、保存コンテンツ、通知、契約状態などをまとめて確認できる会員向けホームになります。"
      plannedItems={[
        "最近閲覧したコンテンツ",
        "お気に入り・保存済みコンテンツの概要",
        "未読通知のサマリー",
        "会員プラン・購入状態の表示",
      ]}
      primaryHref="/contents"
      primaryLabel="コンテンツカタログを見る"
    />
  );
}
