import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getContentById,
  getRelatedContents,
} from "@/features/contents/api/get-contents";
import { getContentDetail } from "@/features/contents/api/get-content-detail";
import { ArticleDetail } from "@/features/contents/components/detail/article-detail";

type ContentDetailPageParams = { params: Promise<{ id: string }> };

/**
 * 記事詳細ルートのメタデータ。記事タイトルを `<title>` に反映する。
 * 記事が見つからない場合は一覧と同じ汎用タイトルにフォールバックする。
 */
export async function generateMetadata({
  params,
}: ContentDetailPageParams): Promise<Metadata> {
  const { id } = await params;
  const content = getContentById(id);
  return {
    title: content
      ? `${content.title} | Modular Member Portal`
      : "コンテンツ詳細 | Modular Member Portal",
  };
}

/**
 * コンテンツ詳細ページ（記事詳細・`/contents/[id]`）。
 *
 * id から一覧コンテンツと本文詳細を引き当て、記事（category="記事"）かつ詳細データが
 * 存在する場合のみ記事詳細を描画する。それ以外（資料/投稿、または未作成 id）は 404。
 * 資料/投稿の詳細は別デザインのため本ルートでは扱わない。データは API abstraction 経由。
 */
export default async function ContentDetailPage({
  params,
}: ContentDetailPageParams) {
  const { id } = await params;

  const content = getContentById(id);
  const detail = getContentDetail(id);

  if (!content || content.category !== "記事" || !detail) {
    notFound();
  }

  const related = getRelatedContents(id);

  return <ArticleDetail content={content} detail={detail} related={related} />;
}
