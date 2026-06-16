import type { Content } from "@/features/contents/types/content";
import type { ProductOffer } from "@/features/contents/types/product-offer";

/**
 * カタログ表示用のコンテンツ単位データ。
 *
 * 価格表示が必要な content（単品購入を含む kind）だけ `offer` を解決済みで持たせ、
 * カード描画時に productId ごとの追加取得（N+1）を発生させない。
 */
export type ContentCatalogItem = {
  content: Content;
  offer?: ProductOffer;
};
