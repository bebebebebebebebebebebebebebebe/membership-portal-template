import type { Metadata } from "next";

import { ArchitectureHighlights } from "./_components/architecture-highlights";
import { ContentAccessOverview } from "./_components/content-access-overview";
import { LandingHero } from "./_components/landing-hero";
import { MvpFeatureOverview } from "./_components/mvp-feature-overview";
import { ZoneOverview } from "./_components/zone-overview";

export const metadata: Metadata = {
  title: "Modular Member Portal | 公開・会員・購入型コンテンツポータル",
  description:
    "無料公開・ログイン限定・有料プラン・単品購入など、コンテンツごとに閲覧条件を分けられる会員制情報ポータルのテンプレートです。",
};

/**
 * Public Home（公開トップ・/）。
 *
 * 公開・会員・購入型ポータルの入口として、ヒーロー → 閲覧条件の説明 → ゾーン構成 →
 * MVP 機能 → アーキテクチャの順にセクションを縦積みする。各セクションは静的な
 * Server Component で、認証状態に依存しない。
 */
export default function PublicHomePage() {
  return (
    <div className="flex flex-col gap-16">
      <LandingHero />
      <ContentAccessOverview />
      <ZoneOverview />
      <MvpFeatureOverview />
      <ArchitectureHighlights />
    </div>
  );
}
