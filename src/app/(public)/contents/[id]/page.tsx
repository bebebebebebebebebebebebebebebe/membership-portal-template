import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getContentDetail } from "@/features/contents/api/get-content-detail";
import { getContentMetadata } from "@/features/contents/api/get-content-metadata";
import { getContentPreview } from "@/features/contents/api/get-content-preview";
import { getContentViewer } from "@/features/contents/api/get-content-viewer";
import { getRelatedContents } from "@/features/contents/api/get-contents";
import { ContentAccessGate } from "@/features/contents/components/content-access-gate";
import { ArticleDetail } from "@/features/contents/components/detail/article-detail";
import { canViewContent } from "@/features/contents/utils/content-access";
import { isPubliclyAccessibleContentMetadata } from "@/features/contents/utils/content-publication";
import { ComingSoonPage } from "@/components/coming-soon-page";

type ContentDetailPageParams = { params: Promise<{ id: string }> };

/**
 * 記事詳細ルートのメタデータ。認可前に取得してよい metadata だけを使い、記事タイトルを
 * `<title>` に反映する。記事が見つからない場合は汎用タイトルにフォールバックする。
 */
export async function generateMetadata({
  params,
}: ContentDetailPageParams): Promise<Metadata> {
  const { id } = await params;
  const content = getContentMetadata(id);

  return {
    title: content
      ? `${content.title} | Modular Member Portal`
      : "コンテンツ詳細 | Modular Member Portal",
  };
}

/**
 * コンテンツ詳細ページ（公開・/contents/[id]）。
 *
 * Route Guard ではなく Content Gate で本文の閲覧可否を制御する公開ページ。
 * metadata → 公開可否 → content kind → viewer → 閲覧可否判定の順に評価し、
 * `getContentDetail()`（full body）は認可（allowed）に通った後でだけ呼ぶ。
 * 閲覧不可なら preview と Content Gate を表示する。資料は詳細 UI 未実装のため Coming Soon を返し、
 * 直アクセス不可（hidden/未公開）・未作成 id は 404。
 */
export default async function ContentDetailPage({
  params,
}: ContentDetailPageParams) {
  const { id } = await params;

  const content = getContentMetadata(id);

  if (!content || !isPubliclyAccessibleContentMetadata(content)) {
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

  const viewer = await getContentViewer();
  const decision = canViewContent(content.accessPolicy, viewer);

  if (!decision.allowed) {
    return (
      <ContentAccessGate
        content={content}
        preview={getContentPreview(id)}
        reason={decision.reason}
      />
    );
  }

  const detail = getContentDetail(id);

  if (!detail) {
    notFound();
  }

  const related = getRelatedContents(id);

  return (
    <ArticleDetail
      content={content}
      detail={detail}
      related={related}
      currentUser={viewer.user}
    />
  );
}
