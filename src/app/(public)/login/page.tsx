import { Suspense } from "react";
import type { Metadata } from "next";

import { ComingSoonPage } from "@/components/coming-soon-page";

import { LoginNextNotice } from "./_components/login-next-notice";

export const metadata: Metadata = {
  title: "ログイン | Modular Member Portal",
  description: "ログイン機能は現在準備中です。",
};

/**
 * ログイン route の Coming Soon ページ。
 *
 * page 本体は `searchParams` を await せず static shell を返す。戻り先（`next`）の案内だけを
 * `<Suspense>` 内の `LoginNextNotice` に隔離し、request time に stream する。
 */
export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <ComingSoonPage
        eyebrow="Public Zone"
        title="ログイン機能は準備中です"
        description="認証基盤を導入後、ログイン完了後に Member Zone へ戻れる入口になります。"
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
      <Suspense fallback={null}>
        <LoginNextNotice searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
