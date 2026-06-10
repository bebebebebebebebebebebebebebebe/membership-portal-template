import type { Metadata } from "next";

import { ComingSoonPage } from "@/components/coming-soon-page";

export const metadata: Metadata = {
  title: "アカウント設定 | Modular Member Portal",
  description: "アカウント設定は現在準備中です。",
};

/**
 * アカウント設定 route の Coming Soon ページ。
 */
export default function AccountSettingsPage() {
  return (
    <ComingSoonPage
      eyebrow="Member Zone"
      title="アカウント設定は準備中です"
      description="メールアドレス、パスワード、認証方法、会員プランを管理するページになります。"
      plannedItems={[
        "メールアドレス変更",
        "パスワード変更",
        "認証 provider との連携",
        "会員プラン・購入履歴への導線",
      ]}
      primaryHref="/dashboard"
      primaryLabel="ダッシュボードへ"
    />
  );
}
