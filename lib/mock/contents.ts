import {
  FavouriteIcon,
  Files01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

/**
 * コンテンツの種別。README の方針どおり種別は限定しない汎用骨格だが、
 * デザイン再現のためのモックとして代表的な 3 種（記事 / 資料 / 投稿）を定義する。
 */
export type ContentCategory = "記事" | "資料" | "投稿";

/** 著者情報。アバター読み込み失敗時は initials を Avatar フォールバックに表示する。 */
type Author = {
  name: string;
  avatar: string;
  initials: string;
};

/** 全種別に共通するコンテンツの基本フィールド。 */
type ContentBase = {
  id: string;
  title: string;
  description: string;
  /** サムネイル画像（public/images/contents 配下のローカル参照） */
  thumbnail: string;
  /** カードに表示するカテゴリタグ（カラーチップ） */
  tags: string[];
};

/** 記事: 著者・公開日・読了時間を持つ。 */
export type ArticleContent = ContentBase & {
  category: "記事";
  author: Author;
  date: string;
  readMinutes: number;
};

/** 資料: ファイル形式・ページ数・ダウンロード数を持つ。 */
export type DocumentContent = ContentBase & {
  category: "資料";
  fileFormat: "PDF" | "XLSX" | "DOCX";
  pageCount: number;
  downloadCount: number;
};

/** 投稿: 著者・コメント数・投稿日を持つ。 */
export type PostContent = ContentBase & {
  category: "投稿";
  author: Author;
  date: string;
  commentCount: number;
};

/**
 * 一覧カード 1 枚分のコンテンツ。種別ごとにフッターの構成が異なるため、
 * `category` を判別子とする判別ユニオンで表現し、描画側で網羅的に出し分ける。
 */
export type Content = ArticleContent | DocumentContent | PostContent;

/**
 * カテゴリごとの表示メタ。バッジ色は種別を視覚的に区別するための装飾色で、
 * 記事=ティール（プライマリ）/ 資料=ブルー / 投稿=パープル。
 */
export const categoryMeta: Record<
  ContentCategory,
  { badgeClass: string; tagClass: string }
> = {
  記事: {
    badgeClass: "bg-primary text-primary-foreground",
    tagClass: "bg-primary/10 text-primary",
  },
  資料: {
    badgeClass: "bg-blue-500 text-white",
    tagClass: "bg-blue-50 text-blue-700",
  },
  投稿: {
    badgeClass: "bg-purple-500 text-white",
    tagClass: "bg-green-50 text-green-700",
  },
};

/** 統計カード 1 枚分の値。アイコンは hugeicons の IconSvgElement。 */
export type ContentStat = {
  label: string;
  value: number;
  icon: IconSvgElement;
  /** 装飾色（星のお気に入りのみ amber、他はティールのプライマリ） */
  accent: "primary" | "amber";
};

export const contentStats: ContentStat[] = [
  { label: "総コンテンツ", value: 248, icon: Files01Icon, accent: "primary" },
  { label: "お気に入り", value: 32, icon: FavouriteIcon, accent: "amber" },
  { label: "今週の新着", value: 18, icon: SparklesIcon, accent: "primary" },
];

/** フィルタタブに用いる種別の一覧（タブ先頭の「すべて」は UI 側で付与）。 */
export const contentCategories: ContentCategory[] = ["記事", "資料", "投稿"];

/** 件数表示用の総コンテンツ件数。 */
export const totalContentCount = 248;

/** 現在のフィルタ適用後の検索結果件数（モック固定値）。 */
export const resultCount = 24;

export const mockContents: Content[] = [
  {
    id: "1",
    category: "記事",
    title: "生成AIを業務に活かす6つのステップ",
    description:
      "企画から運用までの実践プロセスを解説。すぐに使えるプロンプト例も紹介します。",
    thumbnail: "/images/contents/thumb-01.jpg",
    tags: ["AI活用", "業務効率化", "入門"],
    author: { name: "鈴木 花子", avatar: "/images/avatars/avatar-02.jpg", initials: "鈴木" },
    date: "2024/05/10",
    readMinutes: 8,
  },
  {
    id: "2",
    category: "資料",
    title: "プロダクト開発ガイドライン 2024",
    description:
      "開発プロセス、設計原則、レビュー基準などを体系的にまとめた公式ガイドラインです。",
    thumbnail: "/images/contents/thumb-02.jpg",
    tags: ["開発プロセス", "設計", "ガイドライン"],
    fileFormat: "PDF",
    pageCount: 42,
    downloadCount: 1256,
  },
  {
    id: "3",
    category: "投稿",
    title: "リモートワークでのチーム連携のコツ",
    description:
      "非同期コミュニケーションを前提に、信頼を保ちながら成果を出す運用の知見を共有します。",
    thumbnail: "/images/contents/thumb-03.jpg",
    tags: ["リモートワーク", "チーム運営"],
    author: { name: "高橋 直樹", avatar: "/images/avatars/avatar-03.jpg", initials: "高橋" },
    date: "2024/05/08",
    commentCount: 24,
  },
  {
    id: "4",
    category: "記事",
    title: "ゼロから学ぶクラウドインフラ設計",
    description:
      "スケーラビリティと可用性を両立させるクラウドアーキテクチャの基礎を学びます。",
    thumbnail: "/images/contents/thumb-04.jpg",
    tags: ["インフラ", "クラウド", "設計"],
    author: { name: "田中 陽子", avatar: "/images/avatars/avatar-04.jpg", initials: "田中" },
    date: "2024/05/06",
    readMinutes: 12,
  },
  {
    id: "5",
    category: "資料",
    title: "セキュリティ対策チェックリスト",
    description:
      "Webアプリケーションで押さえるべき脆弱性対策を、優先度別に整理した実務資料。",
    thumbnail: "/images/contents/thumb-05.jpg",
    tags: ["セキュリティ", "チェックリスト"],
    fileFormat: "XLSX",
    pageCount: 18,
    downloadCount: 873,
  },
  {
    id: "6",
    category: "投稿",
    title: "データ可視化で意思決定を加速する",
    description:
      "ダッシュボード設計の原則と、伝わるグラフ表現のためのデザインテクニックを紹介します。",
    thumbnail: "/images/contents/thumb-06.jpg",
    tags: ["データ分析", "可視化"],
    author: { name: "渡辺 さくら", avatar: "/images/avatars/avatar-01.jpg", initials: "渡辺" },
    date: "2024/05/04",
    commentCount: 17,
  },
  {
    id: "7",
    category: "記事",
    title: "モダンJavaScript開発の最前線",
    description:
      "最新のフレームワーク動向とツールチェーンを俯瞰し、技術選定の判断軸を提示します。",
    thumbnail: "/images/contents/thumb-07.jpg",
    tags: ["JavaScript", "フロントエンド"],
    author: { name: "中村 拓也", avatar: "/images/avatars/avatar-02.jpg", initials: "中村" },
    date: "2024/05/02",
    readMinutes: 10,
  },
  {
    id: "8",
    category: "資料",
    title: "プロジェクト管理テンプレート集",
    description:
      "そのまま使える進捗管理・要件定義・振り返り用のテンプレートをまとめました。",
    thumbnail: "/images/contents/thumb-08.jpg",
    tags: ["プロジェクト管理", "テンプレート"],
    fileFormat: "DOCX",
    pageCount: 24,
    downloadCount: 642,
  },
  {
    id: "9",
    category: "投稿",
    title: "新入社員向けオンボーディングの記録",
    description:
      "会社のカルチャーと業務フローを短時間で理解してもらうための取り組みを共有します。",
    thumbnail: "/images/contents/thumb-09.jpg",
    tags: ["オンボーディング", "組織"],
    author: { name: "加藤 大輔", avatar: "/images/avatars/avatar-04.jpg", initials: "加藤" },
    date: "2024/04/30",
    commentCount: 31,
  },
];
