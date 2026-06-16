import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ComingSoonPage } from "@/components/coming-soon-page";
import { getContentMetadata } from "@/features/contents/api/get-content-metadata";
import { getContentViewer } from "@/features/contents/api/get-content-viewer";
import { ContentAccessFallback } from "@/features/contents/components/content-access-fallback";
import { ContentRouteGuardSlot } from "@/features/contents/components/detail/content-route-guard-slot";
import { PersonalizedContentAccess } from "@/features/contents/components/detail/personalized-content-access";
import type { Content } from "@/features/contents/types/content";
import type { ContentViewer } from "@/features/contents/types/content-viewer";
import { canAccessContentRoute } from "@/features/contents/utils/content-route-access";
import { isPubliclyAccessibleContentMetadata } from "@/features/contents/utils/content-publication";
import { createLoginRedirectPath } from "@/lib/auth/auth-redirect";

type ContentDetailPageParams = { params: Promise<{ id: string }> };

/**
 * loginRequired content だけ、Suspense fallback を返す前に URL 到達条件を最終確認する。
 *
 * redirect を Suspense 内で実行すると fallback が先に stream され得るため、
 * route-level protected content では page 本体で viewer を解決する。
 */
async function getRouteGuardedViewer(
  id: string,
  content: Content
): Promise<ContentViewer | null> {
  if (content.routeAccessPolicy.kind !== "loginRequired") {
    return null;
  }

  const viewer = await getContentViewer();
  const routeDecision = canAccessContentRoute(
    content.routeAccessPolicy,
    viewer.user
  );

  if (!routeDecision.allowed) {
    redirect(createLoginRedirectPath(`/contents/${encodeURIComponent(id)}`));
  }

  return viewer;
}

/**
 * 記事詳細ルートのメタデータ。認可前に取得してよい metadata だけを使い、記事タイトルを
 * `<title>` に反映する。記事が見つからない場合は汎用タイトルにフォールバックする。
 */
export async function generateMetadata({
  params,
}: ContentDetailPageParams): Promise<Metadata> {
  const { id } = await params;
  const content = await getContentMetadata(id);

  return {
    title: content
      ? `${content.title} | Modular Member Portal`
      : "コンテンツ詳細 | Modular Member Portal",
  };
}

/**
 * コンテンツ詳細ページ（公開・/contents/[id]）。
 *
 * metadata → 公開可否 → loginRequired route guard までは Suspense より前で評価する。
 * route-level protected content では fallback を返す前に redirect を完了し、public content の
 * viewer 取得・accessPolicy・full detail 取得だけを Suspense 内の Server Component に閉じる。
 * 資料は詳細 UI 未実装のため Coming Soon を返し、hidden/未公開・未作成 id は 404。
 */
export default async function ContentDetailPage({
  params,
}: ContentDetailPageParams) {
  const { id } = await params;

  const content = await getContentMetadata(id);

  if (!content || !isPubliclyAccessibleContentMetadata(content)) {
    notFound();
  }

  const routeGuardedViewer = await getRouteGuardedViewer(id, content);

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
      {routeGuardedViewer ? (
        <PersonalizedContentAccess
          id={id}
          content={content}
          viewer={routeGuardedViewer}
        />
      ) : (
        <ContentRouteGuardSlot id={id} content={content} />
      )}
    </Suspense>
  );
}
