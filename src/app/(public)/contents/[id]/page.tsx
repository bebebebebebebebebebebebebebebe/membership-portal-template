import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
 * コンテンツ詳細ルートのメタデータ。認可前に取得してよい metadata だけを使い、タイトルを
 * `<title>` に反映する。見つからない場合は汎用タイトルにフォールバックする。
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
 * request time に stream する。hidden/未公開・未作成 id は 404。
 */
export default async function ContentDetailPage({
  params,
}: ContentDetailPageParams) {
  const { id } = await params;

  const content = await getPublicContentMetadata(id);

  if (!content) {
    notFound();
  }

  return (
    <Suspense fallback={<ContentAccessFallback content={content} />}>
      <ContentRouteGuardSlot id={id} content={content} />
    </Suspense>
  );
}
