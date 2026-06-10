import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Public Zone（認証不要ゾーン）共通レイアウト。
 *
 * トップ・公開カタログ・コンテンツ詳細など非会員にも開放するページで共有する shell。
 * Member Zone のサイドバー／認証境界は持たず、ロゴと公開導線（コンテンツ・ログイン・新規登録）
 * だけの軽量ヘッダーと中央寄せの main コンテナ（背景・最大幅・余白）を提供する。
 * client hook を使わない静的 shell のため Server Component のまま扱う。
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="font-bold tracking-tight">
            Modular Member Portal
          </Link>

          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/contents">コンテンツ</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">ログイン</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">新規登録</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
