import type { ContentDetail } from "@/features/contents/types/content-detail";

/**
 * 汎用 CMS の詳細モックを組み立てるファクトリ。
 *
 * content type 固有の構造を持たず、要点・本文セクション・ステップ・目次・コメントという
 * generic な structured detail を生成する。`overrides` で id ごとに文言を差し替える。
 *
 * @param overrides - id ごとに差し替える要点本文・サイクルラベルなど。
 * @returns generic な ContentDetail。
 */
function makeContentDetail(overrides: {
  summaryBody: string;
  overviewBody: string;
  pointBody: string;
  conclusion: string;
  cycleLabel: string;
  viewCount: number;
}): ContentDetail {
  return {
    viewCount: overrides.viewCount,
    publishedDate: "2024/05/10",
    updatedDate: "2024/05/16",
    summary: {
      title: "このコンテンツの要点",
      body: overrides.summaryBody,
    },
    sections: [
      {
        id: "overview",
        heading: "概要",
        paragraphs: [overrides.overviewBody],
      },
      {
        id: "introduction",
        heading: "ポイント",
        paragraphs: [
          "小さく始めて効果を検証し、学びを得ながら段階的に広げていくアプローチが有効です。",
        ],
        callout: {
          title: "ポイント",
          body: overrides.pointBody,
        },
      },
    ],
    steps: [
      { title: "目的の明確化", description: "解決したい課題と期待する成果を定義する" },
      { title: "対象の選定", description: "インパクトが大きく実現しやすい範囲を選ぶ" },
      { title: "試験導入", description: "小さく始めて効果と課題を検証する" },
      { title: "設計と最適化", description: "目的に合わせて設計を最適化する" },
      { title: "運用と展開", description: "ルール整備と教育を行い展開する" },
      { title: "継続的な改善", description: "効果測定とフィードバックで改善する" },
    ],
    conclusion: overrides.conclusion,
    cycleLabel: overrides.cycleLabel,
    toc: [
      { id: "overview", label: "概要" },
      { id: "introduction", label: "ポイント" },
      {
        id: "steps",
        label: "6つのステップ",
        children: [
          { label: "目的の明確化" },
          { label: "対象の選定" },
          { label: "試験導入" },
          { label: "設計と最適化" },
          { label: "運用と展開" },
          { label: "継続的な改善" },
        ],
      },
      { id: "conclusion", label: "まとめ" },
    ],
    comments: [
      {
        author: {
          name: "田中 健一",
          avatar: "/images/avatars/avatar-05.jpg",
          initials: "田中",
        },
        datetime: "2024/05/11 10:23",
        body: "具体例が分かりやすく、すぐに試してみたい内容でした。",
      },
      {
        author: {
          name: "佐藤 美咲",
          avatar: "/images/avatars/avatar-03.jpg",
          initials: "佐藤",
        },
        datetime: "2024/05/11 09:15",
        body: "段階的に進める重要性を改めて実感しました。",
      },
    ],
  };
}

/**
 * content id をキーにした詳細モックデータ。
 *
 * 到達可能（listed-published および unlisted-published）な id に generic な本文を用意し、
 * カードや直リンクからの詳細表示・全 accessPolicy kind の実演を機能させる。
 */
export const mockContentDetails: Record<string, ContentDetail> = {
  "1": makeContentDetail({
    summaryBody:
      "ログイン不要で閲覧できる公開コンテンツの基本動作を示すサンプルです。",
    overviewBody:
      "free アクセスのコンテンツは、匿名ユーザーでも full detail を閲覧できます。",
    pointBody: "公開コンテンツは認可ゲートを通らず本文を表示します。",
    conclusion: "公開コンテンツはカタログと詳細の基本フローを確認するのに適しています。",
    cycleLabel: "公開コンテンツのサイクル",
    viewCount: 1256,
  }),
  "2": makeContentDetail({
    summaryBody:
      "ログイン済みユーザーだけが本文を閲覧できる loginRequired サンプルです。",
    overviewBody:
      "匿名ユーザーには Content Gate を表示し、ログイン後に full detail を見せます。",
    pointBody: "URL 到達は public、本文閲覧は loginRequired という組み合わせを確認できます。",
    conclusion: "loginRequired は会員向けコンテンツの最小構成として利用できます。",
    cycleLabel: "ログイン必須コンテンツのサイクル",
    viewCount: 982,
  }),
  "4": makeContentDetail({
    summaryBody:
      "対象プランのユーザーだけが本文を閲覧できる planRequired サンプルです。",
    overviewBody:
      "プラン条件を満たさない場合は Content Gate でプラン導線を表示します。",
    pointBody: "requiredPlans に一致する viewer.plan のときだけ本文を表示します。",
    conclusion: "planRequired はサブスクリプション型の限定コンテンツに利用できます。",
    cycleLabel: "プラン限定コンテンツのサイクル",
    viewCount: 743,
  }),
  "5": makeContentDetail({
    summaryBody:
      "単品購入後に本文を閲覧できる purchaseRequired サンプルです。",
    overviewBody:
      "購入済み productId を持つ viewer だけが full detail を閲覧できます。",
    pointBody: "purchasedProductIds に productId が含まれるかで判定します。",
    conclusion: "purchaseRequired は単品販売コンテンツに利用できます。",
    cycleLabel: "単品購入コンテンツのサイクル",
    viewCount: 531,
  }),
  "7": makeContentDetail({
    summaryBody:
      "プラン加入か単品購入のいずれかで本文を閲覧できる planOrPurchase サンプルです。",
    overviewBody:
      "プラン条件か購入条件のどちらかを満たせば full detail を閲覧できます。",
    pointBody: "プランと購入の両導線を Content Gate に並べて提示します。",
    conclusion: "planOrPurchase は柔軟な課金導線を持つコンテンツに利用できます。",
    cycleLabel: "プランまたは単品購入のサイクル",
    viewCount: 1543,
  }),
  "8": makeContentDetail({
    summaryBody:
      "ログイン不要で閲覧できるもう 1 件の公開コンテンツサンプルです。",
    overviewBody:
      "一覧に複数件の公開コンテンツが並ぶ表示を確認できます。",
    pointBody: "free アクセスの追加サンプルとして利用します。",
    conclusion: "複数の公開コンテンツでカタログのグリッド表示を確認できます。",
    cycleLabel: "公開コンテンツのサイクル",
    viewCount: 642,
  }),
  "member-only-blueprint": makeContentDetail({
    summaryBody:
      "URL 到達条件（loginRequired）と本文閲覧条件（planRequired）を分けた検証用コンテンツです。",
    overviewBody:
      "詳細 URL 自体をログイン必須にしつつ、本文 full detail はプラン条件でさらに制御します。",
    pointBody:
      "URL 到達条件と本文閲覧条件を分けると、公開 preview と限定本文の責務が明確になります。",
    conclusion:
      "routeAccessPolicy と accessPolicy を分離すると、URL 保護と本文保護を独立して拡張できます。",
    cycleLabel: "会員限定アクセス設計のサイクル",
    viewCount: 321,
  }),
  "unlisted-sample": makeContentDetail({
    summaryBody:
      "一覧には出ないが URL を知ればログイン後に到達できる unlisted サンプルです。",
    overviewBody:
      "discoverability=unlisted は一覧から除外しつつ URL 直アクセスは許可します。",
    pointBody: "unlisted は限定共有リンク向けの発見可能性として利用できます。",
    conclusion: "unlisted はカタログ非掲載の限定共有コンテンツに利用できます。",
    cycleLabel: "限定共有コンテンツのサイクル",
    viewCount: 34,
  }),
};
