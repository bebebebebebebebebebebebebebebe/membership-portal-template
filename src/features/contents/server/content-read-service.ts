import "server-only";

import { cache } from "react";

import {
  getMockContentDetailForViewer,
  getMockContentMetadata,
  getMockContentPreview,
  getMockContents,
  getMockProductOffer,
  getMockRelatedContents,
  type MockContentDetailAccessResult,
} from "@/features/contents/server/mock-content-repository";
import type { Content } from "@/features/contents/types/content";
import type { ContentCatalogItem } from "@/features/contents/types/content-catalog";
import type { ContentPreview } from "@/features/contents/types/content-preview";
import type { ContentViewer } from "@/features/contents/types/content-viewer";
import { isPubliclyAccessibleContentMetadata } from "@/features/contents/utils/content-publication";

/**
 * 価格解決に使う productId を accessPolicy から取り出す。
 *
 * 価格表示が必要なのは単品購入を含む kind だけなので、それ以外は `null` を返す。
 */
function getProductIdForAccess(policy: Content["accessPolicy"]): string | null {
  switch (policy.kind) {
    case "purchaseRequired":
    case "planOrPurchase":
      return policy.productId;
    default:
      return null;
  }
}

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
    return getMockContents().map((content) => {
      const productId = getProductIdForAccess(content.accessPolicy);

      return {
        content,
        offer: productId ? getMockProductOffer(productId) : undefined,
      };
    });
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
  return getMockContents().map((content) => content.id);
});

/**
 * URL 到達可能な content の認可前 metadata を返す。
 *
 * unlisted-published も URL 解決可能にするため `getMockContentMetadata` を起点にし、
 * hidden / 未公開は除外する。
 *
 * @param id コンテンツ ID。
 * @returns 公開到達可能な metadata。到達不可・不在は `undefined`。
 */
export const getPublicContentMetadata = cache(
  async (id: string): Promise<Content | undefined> => {
    const content = getMockContentMetadata(id);

    if (!content || !isPubliclyAccessibleContentMetadata(content)) {
      return undefined;
    }

    return content;
  }
);

/**
 * 閲覧不可状態でも表示できる preview を返す。
 *
 * @param id コンテンツ ID。
 * @returns metadata 由来の安全な preview。存在しない場合は `undefined`。
 */
export const getPublicContentPreview = cache(
  async (id: string): Promise<ContentPreview | undefined> => {
    return getMockContentPreview(id);
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
    return getMockRelatedContents(id, limit);
  }
);

/**
 * viewer の閲覧権限を確認したうえで full detail を取得する。
 *
 * full body は認可済みの場合だけ取得する。internal API を経由せず、server data access
 * から直接認可結果を得る。
 *
 * @param id コンテンツ ID。
 * @param viewer 認可判定用の閲覧者状態。
 * @returns full detail 取得の認可結果。
 */
export async function getAuthorizedContentDetail(
  id: string,
  viewer: ContentViewer
): Promise<MockContentDetailAccessResult> {
  return getMockContentDetailForViewer(id, viewer);
}
