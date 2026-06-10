import type { Metadata } from "next";

import { ComingSoonPage } from "@/components/coming-soon-page";

export const metadata: Metadata = {
  title: "ログイン | Modular Member Portal",
  description: "ログイン機能は現在準備中です。",
};

/**
 * ログイン route の Coming Soon ページ。
 */
export default function LoginPage() {
  return (
    <ComingSoonPage
      eyebrow="Public Zone"
      title="ログイン機能は準備中です"
      description="認証基盤を導入後、会員アカウントでログインできる入口になります。"
      plannedItems={[
        "メールアドレスとパスワードによるログイン",
        "認証 provider との接続",
        "ログイン後の Member Zone への遷移",
        "未ログイン時の閲覧制限コンテンツからの誘導",
      ]}
      primaryHref="/contents"
      primaryLabel="コンテンツを見る"
      secondaryHref="/register"
      secondaryLabel="新規登録へ"
    />
  );
}
