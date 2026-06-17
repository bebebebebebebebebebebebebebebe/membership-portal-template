import type { Content } from "@/features/contents/types/content";
import type { ContentDetail } from "@/features/contents/types/content-detail";
import type { ProductOffer } from "@/features/contents/types/product-offer";

/**
 * contents feature の永続化・外部データ取得境界。
 *
 * repository は raw data access だけを担当し、公開可否・routeAccessPolicy・accessPolicy の
 * 判定は content read service に委譲する。
 */
export type ContentRepository = {
  /**
   * すべてのコンテンツ metadata を返す。
   *
   * @returns 公開判定前のコンテンツ metadata 一覧。
   */
  listContents(): Promise<Content[]>;

  /**
   * id に一致するコンテンツ metadata を返す。
   *
   * @param id コンテンツ ID。
   * @returns 公開判定前の metadata。存在しない場合は `undefined`。
   */
  findContentById(id: string): Promise<Content | undefined>;

  /**
   * id に一致する full detail を返す。
   *
   * @param id コンテンツ ID。
   * @returns 本文・コメントを含む詳細。存在しない場合は `undefined`。
   */
  findContentDetailById(id: string): Promise<ContentDetail | undefined>;

  /**
   * productId に対応する販売オファーを返す。
   *
   * @param productId 販売対象 ID。
   * @returns 価格・販売可否を含む offer。存在しない場合は `undefined`。
   */
  findProductOfferById(productId: string): Promise<ProductOffer | undefined>;
};
