import type { ContentRepository } from "@/features/contents/services/content-repository";
import type { Content } from "@/features/contents/types/content";
import type { ContentCatalogItem } from "@/features/contents/types/content-catalog";
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

/**
 * full detail の認可済み取得結果。
 *
 * `notFound` は metadata/detail 不在または公開到達不可、`forbidden` は route/body の
 * 認可不足を表す。HTTP 境界ではこの結果を status code に変換する。
 */
export type AuthorizedContentDetailResult =
  | { status: "ok"; detail: ContentDetail }
  | { status: "notFound" }
  | { status: "forbidden" };

/**
 * contents の read use case 群。
 *
 * repository から raw data を受け取り、公開判定・preview 生成・関連抽出・販売 offer 解決・
 * full detail 認可判定をここで一元化する。
 */
export type ContentReadService = {
  /**
   * カタログ掲載対象のコンテンツと販売 offer を返す。
   *
   * @returns published かつ listed のコンテンツ単位カタログ項目。
   */
  getContentCatalogItems(): Promise<ContentCatalogItem[]>;

  /**
   * `generateStaticParams` の対象 content id を返す。
   *
   * @returns listed-published の content id 一覧。
   */
  getPrerenderableContentIds(): Promise<string[]>;

  /**
   * URL 到達可能な content metadata を返す。
   *
   * @param id - コンテンツ ID。
   * @returns 公開到達可能な metadata。到達不可・不在は `undefined`。
   */
  getPublicContentMetadata(id: string): Promise<Content | undefined>;

  /**
   * 閲覧不可状態でも表示できる preview を返す。
   *
   * @param id - コンテンツ ID。
   * @returns metadata 由来の安全な preview。到達不可・不在は `undefined`。
   */
  getPublicContentPreview(id: string): Promise<ContentPreview | undefined>;

  /**
   * 関連コンテンツを返す。
   *
   * @param id - 現在表示中のコンテンツ ID。
   * @param limit - 返却件数の上限。
   * @returns published かつ listed に限定した関連コンテンツ一覧。
   */
  getPublicRelatedContents(id: string, limit?: number): Promise<Content[]>;

  /**
   * productId に対応する販売オファーを返す。
   *
   * @param productId - 販売対象 ID。
   * @returns 価格・販売可否を含む offer。存在しない場合は `undefined`。
   */
  getProductOffer(productId: string): Promise<ProductOffer | undefined>;

  /**
   * viewer の閲覧権限を確認したうえで full detail を取得する。
   *
   * @param id - コンテンツ ID。
   * @param viewer - 認可判定用の閲覧者状態。
   * @returns full detail 取得の認可結果。
   */
  getAuthorizedContentDetail(
    id: string,
    viewer: ContentViewer
  ): Promise<AuthorizedContentDetailResult>;
};

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
 * repository を注入して contents read use case を作成する。
 *
 * repository 実装を mock / DB / external API に差し替えても、公開判定・認可判定・HTTP 境界の
 * 呼び出し contract を維持する。
 *
 * @param repository - raw data access を担当する repository。
 * @returns contents read use case 群。
 */
export function createContentReadService(
  repository: ContentRepository
): ContentReadService {
  return {
    async getContentCatalogItems() {
      const contents = (await repository.listContents()).filter(
        isListedPublishedContent
      );

      return Promise.all(
        contents.map(async (content) => {
          const productId = getProductIdForAccess(content.accessPolicy);

          return {
            content,
            offer: productId
              ? await repository.findProductOfferById(productId)
              : undefined,
          };
        })
      );
    },

    async getPrerenderableContentIds() {
      return (await repository.listContents())
        .filter(isListedPublishedContent)
        .map((content) => content.id);
    },

    async getPublicContentMetadata(id) {
      const content = await repository.findContentById(id);

      if (!content || !isPubliclyAccessibleContentMetadata(content)) {
        return undefined;
      }

      return content;
    },

    async getPublicContentPreview(id) {
      const content = await repository.findContentById(id);

      if (!content || !isPubliclyAccessibleContentMetadata(content)) {
        return undefined;
      }

      return {
        id: content.id,
        introduction: content.description,
      };
    },

    async getPublicRelatedContents(id, limit = 4) {
      return (await repository.listContents())
        .filter(isListedPublishedContent)
        .filter((item) => item.id !== id)
        .slice(0, limit);
    },

    async getProductOffer(productId) {
      return repository.findProductOfferById(productId);
    },

    async getAuthorizedContentDetail(id, viewer) {
      const metadata = await repository.findContentById(id);

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

      const contentDecision = canViewContent(metadata.accessPolicy, viewer);

      if (!contentDecision.allowed) {
        return { status: "forbidden" };
      }

      const detail = await repository.findContentDetailById(id);

      if (!detail) {
        return { status: "notFound" };
      }

      return { status: "ok", detail };
    },
  };
}
