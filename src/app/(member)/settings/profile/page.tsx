import type { Metadata } from "next";

import { ComingSoonPage } from "@/components/coming-soon-page";

export const metadata: Metadata = {
  title: "プロフィール設定 | Modular Member Portal",
  description: "プロフィール設定は現在準備中です。",
};

/**
 * プロフィール設定 route の Coming Soon ページ。
 */
export default function ProfileSettingsPage() {
  return (
    <ComingSoonPage
      eyebrow="Member Zone"
      title="プロフィール設定は準備中です"
      description="表示名、アバター、プロフィール情報を編集できる設定ページになります。"
      plannedItems={[
        "表示名・プロフィール画像の変更",
        "プロフィール情報の編集",
        "公開プロフィールの設定",
        "将来の通知・表示設定との連携",
      ]}
      primaryHref="/dashboard"
      primaryLabel="ダッシュボードへ"
    />
  );
}
