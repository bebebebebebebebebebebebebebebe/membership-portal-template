import type { Metadata } from "next";

import { ComingSoonPage } from "@/components/coming-soon-page";

export const metadata: Metadata = {
  title: "通知 | Modular Member Portal",
  description: "通知機能は現在準備中です。",
};

/**
 * 通知 route の Coming Soon ページ。
 */
export default function NotificationsPage() {
  return (
    <ComingSoonPage
      eyebrow="Member Zone"
      title="通知機能は準備中です"
      description="新着コンテンツ、プラン更新、購入状態、管理者からのお知らせを確認できるページになります。"
      plannedItems={[
        "未読・既読の管理",
        "新着コンテンツ通知",
        "プラン・購入関連通知",
        "管理者からのお知らせ",
      ]}
      primaryHref="/contents"
      primaryLabel="コンテンツカタログを見る"
    />
  );
}
