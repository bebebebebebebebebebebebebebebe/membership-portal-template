import type { ContentAccessPolicy } from "@/features/contents/types/content-access";
import type {
  Discoverability,
  PublicationStatus,
} from "@/features/contents/types/content-publication";

/**
 * コンテンツの種別。
 *
 * README の方針どおり種別は限定しない汎用骨格だが、現時点のモックでは
 * デザイン再現のため代表的な 2 種（記事 / 資料）を扱う。
 */
export type ContentCategory = "記事" | "資料";

/**
 * 著者情報。
 *
 * アバター画像の読み込みに失敗した場合は `initials` を Avatar fallback に表示する。
 */
export type Author = {
  name: string;
  avatar: string;
  initials: string;
};

/** 全種別に共通するコンテンツの基本フィールド。 */
export type ContentBase = {
  id: string;
  title: string;
  description: string;
  /** サムネイル画像（public/images/contents 配下のローカル参照）。 */
  thumbnail: string;
  /** カードに表示するカテゴリタグ（カラーチップ）。 */
  tags: string[];
  /** 本文の公開ライフサイクル状態。 */
  publicationStatus: PublicationStatus;
  /** 一覧や検索などでの発見可能性。 */
  discoverability: Discoverability;
  /** コンテンツ本文の閲覧条件。 */
  accessPolicy: ContentAccessPolicy;
};

/** 記事コンテンツ。著者・公開日・読了時間を持つ。 */
export type ArticleContent = ContentBase & {
  category: "記事";
  author: Author;
  date: string;
  readMinutes: number;
};

/** 資料コンテンツ。ファイル形式・ページ数・ダウンロード数を持つ。 */
export type DocumentContent = ContentBase & {
  category: "資料";
  fileFormat: "PDF" | "XLSX" | "DOCX";
  pageCount: number;
  downloadCount: number;
};

/**
 * 一覧カード 1 枚分のコンテンツ。
 *
 * 種別ごとにフッターの構成が異なるため、`category` を判別子とする
 * 判別ユニオンで表現し、描画側で網羅的に出し分ける。
 */
export type Content = ArticleContent | DocumentContent;
