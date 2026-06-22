import type { Content } from "@/features/contents/types/content";

/**
 * コンテンツ一覧・関連コンテンツ表示で使う静的モックデータ。
 *
 * 汎用 CMS skeleton として content type 固有のフィールドは持たず、公開状態・発見可能性・
 * 到達条件・閲覧条件の組み合わせを網羅的に検証できるサンプルを用意する。
 */
export const mockContents: Content[] = [
  {
    id: "1",
    title: "公開コンテンツ",
    description:
      "ログイン不要で全文を閲覧できる公開コンテンツです。free アクセスの基本動作を確認できます。",
    thumbnail: "/images/contents/thumb-01.jpg",
    tags: ["公開", "サンプル", "入門"],
    publicationStatus: "published",
    discoverability: "listed",
    routeAccessPolicy: { kind: "public" },
    accessPolicy: { kind: "free" },
  },
  {
    id: "2",
    title: "ログイン必須コンテンツ",
    description:
      "ログイン済みユーザーだけが本文を閲覧できます。loginRequired アクセスの検証用サンプル。",
    thumbnail: "/images/contents/thumb-02.jpg",
    tags: ["会員向け", "サンプル"],
    publicationStatus: "published",
    discoverability: "listed",
    routeAccessPolicy: { kind: "public" },
    accessPolicy: { kind: "loginRequired" },
  },
  {
    id: "4",
    title: "プラン限定コンテンツ",
    description:
      "対象プランのユーザーだけが本文を閲覧できます。planRequired アクセスの検証用サンプル。",
    thumbnail: "/images/contents/thumb-04.jpg",
    tags: ["プラン限定", "サンプル"],
    publicationStatus: "published",
    discoverability: "listed",
    routeAccessPolicy: { kind: "public" },
    accessPolicy: { kind: "planRequired", requiredPlans: ["premium"] },
  },
  {
    id: "5",
    title: "単品購入コンテンツ",
    description:
      "単品購入後に本文を閲覧できます。purchaseRequired アクセスの検証用サンプル。",
    thumbnail: "/images/contents/thumb-05.jpg",
    tags: ["単品購入", "サンプル"],
    publicationStatus: "published",
    discoverability: "listed",
    routeAccessPolicy: { kind: "public" },
    accessPolicy: {
      kind: "purchaseRequired",
      productId: "product-security-checklist",
    },
  },
  {
    id: "7",
    title: "プランまたは単品購入コンテンツ",
    description:
      "対象プラン加入か単品購入のいずれかで本文を閲覧できます。planOrPurchase の検証用サンプル。",
    thumbnail: "/images/contents/thumb-07.jpg",
    tags: ["プラン限定", "単品購入", "サンプル"],
    publicationStatus: "published",
    discoverability: "listed",
    routeAccessPolicy: { kind: "public" },
    accessPolicy: {
      kind: "planOrPurchase",
      requiredPlans: ["standard", "premium"],
      productId: "product-modern-javascript",
    },
  },
  {
    id: "8",
    title: "公開コンテンツ（その2）",
    description:
      "ログイン不要で全文を閲覧できる公開コンテンツです。一覧の複数件表示を確認できます。",
    thumbnail: "/images/contents/thumb-08.jpg",
    tags: ["公開", "サンプル"],
    publicationStatus: "published",
    discoverability: "listed",
    routeAccessPolicy: { kind: "public" },
    accessPolicy: { kind: "free" },
  },
  // 以下は一覧フィルタ（listed-published 判定）と到達条件の確認用。
  // published かつ listed ではない、または loginRequired route のため一覧には表示されない。
  {
    id: "member-only-blueprint",
    title: "会員限定の非掲載コンテンツ",
    description:
      "ログイン後にだけ詳細 URL へ到達できる、会員限定の検証用コンテンツです。",
    thumbnail: "/images/contents/thumb-04.jpg",
    tags: ["会員限定", "非掲載", "確認用"],
    publicationStatus: "published",
    discoverability: "unlisted",
    routeAccessPolicy: { kind: "loginRequired" },
    accessPolicy: { kind: "planRequired", requiredPlans: ["premium"] },
  },
  {
    id: "draft-sample",
    title: "下書きコンテンツ",
    description: "draft + hidden。一覧には表示されない確認用データ。",
    thumbnail: "/images/contents/thumb-01.jpg",
    tags: ["確認用"],
    publicationStatus: "draft",
    discoverability: "hidden",
    routeAccessPolicy: { kind: "public" },
    accessPolicy: { kind: "free" },
  },
  {
    id: "scheduled-sample",
    title: "公開予約コンテンツ",
    description: "scheduled + hidden。一覧には表示されない確認用データ。",
    thumbnail: "/images/contents/thumb-04.jpg",
    tags: ["確認用"],
    publicationStatus: "scheduled",
    discoverability: "hidden",
    routeAccessPolicy: { kind: "public" },
    accessPolicy: { kind: "free" },
  },
  {
    id: "unlisted-sample",
    title: "限定共有コンテンツ",
    description:
      "published + unlisted。URL を知る人だけがアクセスでき一覧には出ない確認用データ。",
    thumbnail: "/images/contents/thumb-02.jpg",
    tags: ["確認用"],
    publicationStatus: "published",
    discoverability: "unlisted",
    routeAccessPolicy: { kind: "public" },
    accessPolicy: { kind: "loginRequired" },
  },
  {
    id: "archived-sample",
    title: "アーカイブ済みコンテンツ",
    description: "archived + hidden。一覧には表示されない確認用データ。",
    thumbnail: "/images/contents/thumb-05.jpg",
    tags: ["確認用"],
    publicationStatus: "archived",
    discoverability: "hidden",
    routeAccessPolicy: { kind: "public" },
    accessPolicy: { kind: "free" },
  },
];
