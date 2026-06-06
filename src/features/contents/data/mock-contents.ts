import type { Content } from "@/features/contents/types/content";

/** コンテンツ一覧・関連コンテンツ表示で使う静的モックデータ。 */
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
];
