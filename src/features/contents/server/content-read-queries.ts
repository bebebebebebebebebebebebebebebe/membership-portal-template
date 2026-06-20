import "server-only";

import { cache } from "react";

import {
  createContentReadService,
  type AuthorizedContentDetailResult,
} from "@/features/contents/services/content-read-service";
import type { Content } from "@/features/contents/types/content";
import type { ContentCatalogItem } from "@/features/contents/types/content-catalog";
import type { ContentPreview } from "@/features/contents/types/content-preview";
import type { ContentViewer } from "@/features/contents/types/content-viewer";
import type { ProductOffer } from "@/features/contents/types/product-offer";

import { getContentRepository } from "./repositories/content-repository-provider";

const contentReadService = createContentReadService(getContentRepository());

/**
 * カタログ掲載対象のコンテンツと、それぞれの販売 offer を解決して返す。
 *
 * 単品購入を含む content だけ offer を解決することで、カード描画時の productId ごとの
 * 追加取得（N+1）を防ぐ。
 *
 * @returns published かつ listed のコンテンツ単位カタログ項目。
 */
export const getContentCatalogItems = cache(
  async (): Promise<ContentCatalogItem[]> => {
    return contentReadService.getContentCatalogItems();
  }
);

/**
 * `generateStaticParams` で static shell を prerender する対象 id を返す。
 *
 * listed-published のみを対象とし、unlisted-published の URL 直アクセスは
 * on-demand（PPR）で解決する。full detail は含めない。
 *
 * @returns prerender 対象の content id 一覧。
 */
export const getPrerenderableContentIds = cache(async (): Promise<string[]> => {
  return contentReadService.getPrerenderableContentIds();
});

/**
 * URL 到達可能な content の認可前 metadata を返す。
 *
 * unlisted-published も URL 解決可能にするため repository の raw metadata を起点にし、
 * hidden / 未公開は content read service で除外する。
 *
 * @param id コンテンツ ID。
 * @returns 公開到達可能な metadata。到達不可・不在は `undefined`。
 */
export const getPublicContentMetadata = cache(
  async (id: string): Promise<Content | undefined> => {
    return contentReadService.getPublicContentMetadata(id);
  }
);

/**
 * 閲覧不可状態でも表示できる preview を返す。
 *
 * @param id コンテンツ ID。
 * @returns metadata 由来の安全な preview。到達不可・不在は `undefined`。
 */
export const getPublicContentPreview = cache(
  async (id: string): Promise<ContentPreview | undefined> => {
    return contentReadService.getPublicContentPreview(id);
  }
);

/**
 * 関連コンテンツを返す。
 *
 * @param id 現在表示中のコンテンツ ID。
 * @param limit 返却件数の上限。
 * @returns published かつ listed に限定した関連コンテンツ一覧。
 */
export const getPublicRelatedContents = cache(
  async (id: string, limit = 4): Promise<Content[]> => {
    return contentReadService.getPublicRelatedContents(id, limit);
  }
);

/**
 * productId に対応する販売オファーを返す。
 *
 * @param productId 販売対象 ID。
 * @returns 価格・販売可否を含む offer。存在しない場合は `undefined`。
 */
export const getProductOffer = cache(
  async (productId: string): Promise<ProductOffer | undefined> => {
    return contentReadService.getProductOffer(productId);
  }
);

/**
 * viewer の閲覧権限を確認したうえで full detail を取得する。
 *
 * full body は認可済みの場合だけ取得する。viewer 依存のため永続 cache せず、
 * request-time の認可処理として application service へ委譲する。
 *
 * @param id コンテンツ ID。
 * @param viewer 認可判定用の閲覧者状態。
 * @returns full detail 取得の認可結果。
 */
export async function getAuthorizedContentDetail(
  id: string,
  viewer: ContentViewer
): Promise<AuthorizedContentDetailResult> {
  return contentReadService.getAuthorizedContentDetail(id, viewer);
}
