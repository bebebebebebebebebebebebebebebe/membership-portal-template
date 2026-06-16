import { mockContentDetails } from "@/features/contents/data/mock-content-details";
import { mockContents } from "@/features/contents/data/mock-contents";
import { mockProductOffers } from "@/features/contents/data/mock-product-offers";
import type { Content } from "@/features/contents/types/content";
import type { ContentDetail } from "@/features/contents/types/content-detail";
import type { ContentPreview } from "@/features/contents/types/content-preview";
import type { ContentViewer } from "@/features/contents/types/content-viewer";
import type { ProductOffer } from "@/features/contents/types/product-offer";
import { canViewContent } from "@/features/contents/utils/content-access";
import { canAccessContentRoute } from "@/features/contents/utils/content-route-access";
import {
  isListedPublishedContent,
  isPubliclyAccessibleContentMetadata,
} from "@/features/contents/utils/content-publication";

/** full detail API の認可済み取得結果。 */
export type MockContentDetailAccessResult =
  | { status: "ok"; detail: ContentDetail }
  | { status: "notFound" }
  | { status: "forbidden" };

/**
 * カタログ掲載対象のコンテンツを返す。
 *
 * @returns published かつ listed のコンテンツ一覧。
 */
export function getMockContents(): Content[] {
  return mockContents.filter(isListedPublishedContent);
}

/**
 * id に一致するコンテンツ metadata を返す。
 *
 * @param id コンテンツ ID。
 * @returns 認可前に扱える metadata。存在しない場合は `undefined`。
 */
export function getMockContentMetadata(id: string): Content | undefined {
  return mockContents.find((item) => item.id === id);
}

/**
 * 閲覧不可状態でも表示できる preview を返す。
 *
 * @param id コンテンツ ID。
 * @returns metadata 由来の安全な preview。存在しない場合は `undefined`。
 */
export function getMockContentPreview(id: string): ContentPreview | undefined {
  const content = getMockContentMetadata(id);

  if (!content) {
    return undefined;
  }

  return {
    id: content.id,
    introduction: content.description,
  };
}

/**
 * id に一致する full detail を返す。
 *
 * @param id コンテンツ ID。
 * @returns 本文・コメントを含む詳細。存在しない場合は `undefined`。
 */
export function getMockContentDetail(id: string): ContentDetail | undefined {
  return mockContentDetails[id];
}

/**
 * 指定 id を除外した関連コンテンツを返す。
 *
 * @param id 現在表示中のコンテンツ ID。
 * @param limit 返却件数の上限。
 * @returns published かつ listed に限定した関連コンテンツ一覧。
 */
export function getMockRelatedContents(id: string, limit = 4): Content[] {
  return getMockContents()
    .filter((item) => item.id !== id)
    .slice(0, limit);
}

/**
 * productId に対応する販売オファーを返す。
 *
 * @param productId 販売対象 ID。
 * @returns 価格・販売可否を含む offer。存在しない場合は `undefined`。
 */
export function getMockProductOffer(
  productId: string
): ProductOffer | undefined {
  return mockProductOffers[productId];
}

/**
 * viewer の閲覧権限を確認したうえで full detail を返す。
 *
 * metadata 非公開または detail 不在は `notFound`、閲覧条件を満たさない場合は
 * `forbidden` として返し、HTTP 境界で status code に変換できるようにする。
 *
 * @param id コンテンツ ID。
 * @param viewer 認可判定用の閲覧者状態。
 * @returns full detail 取得の認可結果。
 */
export function getMockContentDetailForViewer(
  id: string,
  viewer: ContentViewer
): MockContentDetailAccessResult {
  const metadata = getMockContentMetadata(id);

  if (!metadata || !isPubliclyAccessibleContentMetadata(metadata)) {
    return { status: "notFound" };
  }

  const routeDecision = canAccessContentRoute(
    metadata.routeAccessPolicy,
    viewer.user
  );

  if (!routeDecision.allowed) {
    return { status: "forbidden" };
  }

  const decision = canViewContent(metadata.accessPolicy, viewer);

  if (!decision.allowed) {
    return { status: "forbidden" };
  }

  const detail = getMockContentDetail(id);

  if (!detail) {
    return { status: "notFound" };
  }

  return { status: "ok", detail };
}
