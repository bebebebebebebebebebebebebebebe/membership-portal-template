import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * 公開トップのヒーローセクション。
 *
 * サービスの位置づけ（公開・会員・購入型ポータル）を示し、カタログ閲覧・ログイン・新規登録の
 * 主要導線を提示する。`/login` `/register` は未実装ルートだが、将来の認証実装に向けた導線として
 * 先行配置する。
 */
export function LandingHero() {
  return (
    <section className="flex flex-col items-start gap-6 py-8 md:py-12">
      <Badge variant="secondary" className="rounded-md px-2 py-0.5">
        Modular Member Portal
      </Badge>

      <div className="flex max-w-3xl flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          公開・会員・購入型のコンテンツポータル
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          無料公開・ログイン限定・有料プラン・単品購入など、コンテンツごとに閲覧条件を分けられます。
          非会員にもカタログと無料コンテンツを開放しつつ、本文の閲覧可否は accessPolicy で制御します。
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/contents">コンテンツを見る</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/login">ログイン</Link>
        </Button>
        <Button asChild size="lg" variant="ghost">
          <Link href="/register">新規登録</Link>
        </Button>
      </div>
    </section>
  );
}
