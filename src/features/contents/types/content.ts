import type { ContentAccessPolicy } from "@/features/contents/types/content-access";
import type {
  Discoverability,
  PublicationStatus,
} from "@/features/contents/types/content-publication";
import type { ContentRouteAccessPolicy } from "@/features/contents/types/content-route-access";

/**
 * 汎用 CMS コンテンツ項目。
 *
 * 具体的な content type を core に固定せず、
 * カタログ・詳細・公開状態・認可の骨格に必要な generic フィールドだけを持つ。
 * 派生先が独自の content type を追加する場合は、この型を拡張せず別 feature の型として足す。
 */
export type Content = {
  id: string;
  title: string;
  description: string;
  /** サムネイル画像（public/images/contents 配下のローカル参照）。 */
  thumbnail: string;
  /** カードに表示するタグ（カラーチップ）。 */
  tags: string[];
  /** 本文の公開ライフサイクル状態。 */
  publicationStatus: PublicationStatus;
  /** 一覧や検索などでの発見可能性。 */
  discoverability: Discoverability;
  /** コンテンツ詳細 URL 自体への到達条件。 */
  routeAccessPolicy: ContentRouteAccessPolicy;
  /** コンテンツ本文の閲覧条件。 */
  accessPolicy: ContentAccessPolicy;
};
