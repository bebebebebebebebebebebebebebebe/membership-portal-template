import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComingSoonPage } from "@/components/coming-soon-page";
import { ContentAccessFallback } from "@/features/contents/components/content-access-fallback";
import { ContentRouteGuardSlot } from "@/features/contents/components/detail/content-route-guard-slot";
import {
  getPrerenderableContentIds,
  getPublicContentMetadata,
} from "@/features/contents/server/content-read-queries";

type ContentDetailPageParams = { params: Promise<{ id: string }> };

/**
 * static shell を prerender する対象 id を返す。
 *
 * listed-published のみを対象にし、本文 detail は含めない。unlisted-published の
 * URL 直アクセスは on-demand（PPR）で解決する。
 */
export async function generateStaticParams() {
  const ids = await getPrerenderableContentIds();

  return ids.map((id) => ({ id }));
}

/**
 * 記事詳細ルートのメタデータ。認可前に取得してよい metadata だけを使い、記事タイトルを
 * `<title>` に反映する。記事が見つからない場合は汎用タイトルにフォールバックする。
 */
export async function generateMetadata({
  params,
}: ContentDetailPageParams): Promise<Metadata> {
  const { id } = await params;
  const content = await getPublicContentMetadata(id);

  return {
    title: content
      ? `${content.title} | Modular Member Portal`
      : "コンテンツ詳細 | Modular Member Portal",
  };
}

/**
 * コンテンツ詳細ページ（公開・/contents/[id]）。
 *
 * page 本体は認可前 metadata だけで static shell を構成する。viewer 取得・route guard・
 * accessPolicy 判定・full detail 取得は Suspense 内の `ContentRouteGuardSlot` 以下に隔離し、
 * request time に stream する。資料は詳細 UI 未実装のため Coming Soon を返し、
 * hidden/未公開・未作成 id は 404。
 */
export default async function ContentDetailPage({
  params,
}: ContentDetailPageParams) {
  const { id } = await params;

  const content = await getPublicContentMetadata(id);

  if (!content) {
    notFound();
  }

  if (content.category !== "記事") {
    return (
      <ComingSoonPage
        eyebrow="Content Catalog"
        title="資料ページは準備中です"
        description={`${content.title} は現在、資料閲覧ページの準備中です。資料ファイルのプレビュー、購入導線、ダウンロード体験を整備してから公開します。`}
        plannedItems={[
          "資料ファイルのプレビュー表示",
          "閲覧条件に応じた購入・プラン導線",
          "ダウンロード数やページ数などの資料メタ情報表示",
          "資料カテゴリに最適化した関連コンテンツ導線",
        ]}
        primaryHref="/contents"
        primaryLabel="コンテンツカタログを見る"
      />
    );
  }

  return (
    <Suspense fallback={<ContentAccessFallback content={content} />}>
      <ContentRouteGuardSlot id={id} content={content} />
    </Suspense>
  );
}
