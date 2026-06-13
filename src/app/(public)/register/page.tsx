import type { Metadata } from "next";

import { ComingSoonPage } from "@/components/coming-soon-page";

export const metadata: Metadata = {
  title: "新規登録 | Modular Member Portal",
  description: "新規登録機能は現在準備中です。",
};

/**
 * 新規登録 route の Coming Soon ページ。
 */
export default function RegisterPage() {
  return (
    <ComingSoonPage
      eyebrow="Public Zone"
      title="新規登録機能は準備中です"
      description="会員登録機能を導入後、無料会員・有料会員への入口として利用します。"
      plannedItems={[
        "無料会員登録フォーム",
        "利用規約・プライバシーポリシーへの同意",
        "登録後の初期プロフィール作成",
        "将来のプラン加入導線との連携",
      ]}
      primaryHref="/contents"
      primaryLabel="コンテンツを見る"
      secondaryHref="/login"
      secondaryLabel="ログインへ"
    />
  );
}
