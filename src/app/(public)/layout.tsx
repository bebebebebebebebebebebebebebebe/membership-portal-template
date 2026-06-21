import { PublicHeader } from "./_components/public-header";

/**
 * Public Zone（認証不要ゾーン）共通レイアウト。
 *
 * トップ・公開カタログ・コンテンツ詳細など非会員にも開放するページで共有する shell。
 * Member Zone のサイドバー／認証境界は持たず、ロゴと header 導線を持つ軽量ヘッダーと
 * 中央寄せの main コンテナ（背景・最大幅・余白）を提供する。認証状態に依存する header 右端
 * slot は Suspense 内へ隔離し、layout 本体は client hook を使わない静的 shell のまま扱う。
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <PublicHeader />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
