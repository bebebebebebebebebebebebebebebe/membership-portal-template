import type { ContentDetail } from "@/features/contents/types/content-detail";

const aiArticleDetail: ContentDetail = {
  viewCount: 1256,
  publishedDate: "2024/05/10",
  updatedDate: "2024/05/16",
  summary: {
    title: "この記事の要点",
    body: "生成AIを業務に取り入れるための6つのステップを、実践的な視点で解説します。小さく始めて、効果を検証しながらスケールするアプローチで、確実に成果へつなげましょう。",
  },
  sections: [
    {
      id: "overview",
      heading: "概要",
      paragraphs: [
        "生成AIは、文章作成や要約、翻訳、アイデア出しなど、幅広い業務で活用できる強力なツールです。本記事では、企画から運用までの流れを6つのステップに分けて解説し、すぐに使えるプロンプト例も紹介します。",
      ],
    },
    {
      id: "introduction",
      heading: "導入のポイント",
      paragraphs: [
        "成功のカギは「小さく始めて、効果を検証する」こと。いきなり全社展開するのではなく、特定の業務やチームで試し、学びを得ながら改善を重ねていきましょう。",
      ],
      callout: {
        title: "ポイント",
        body: "目的を明確にし、評価指標を事前に設定することで、効果検証がスムーズになります。",
      },
    },
  ],
  steps: [
    { title: "目的の明確化", description: "解決したい課題と期待する成果を定義する" },
    { title: "ユースケースの選定", description: "インパクトが大きく、実現しやすい業務を選ぶ" },
    { title: "試験導入（PoC）", description: "小さく始めて、効果と課題を検証する" },
    { title: "プロンプト設計", description: "目的に合わせたプロンプトを設計・最適化する" },
    { title: "運用と展開", description: "ルール整備と教育を行い、チームへ展開する" },
    { title: "継続的な改善", description: "効果測定とフィードバックで継続的に改善する" },
  ],
  conclusion:
    "生成AIの活用は、正しいステップを踏むことで大きな成果につながります。本記事を参考に、まずは身近な業務から一歩を踏み出してみてください。",
  cycleLabel: "生成AI活用のサイクル",
  toc: [
    { id: "overview", label: "概要" },
    { id: "introduction", label: "導入のポイント" },
    {
      id: "steps",
      label: "6つのステップ",
      children: [
        { label: "目的の明確化" },
        { label: "ユースケースの選定" },
        { label: "試験導入（PoC）" },
        { label: "プロンプト設計" },
        { label: "運用と展開" },
        { label: "継続的な改善" },
      ],
    },
    { id: "conclusion", label: "まとめ" },
  ],
  comments: [
    {
      author: { name: "田中 健一", avatar: "/images/avatars/avatar-05.jpg", initials: "田中" },
      datetime: "2024/05/11 10:23",
      body: "プロンプト設計の例がとても参考になりました。特に「役割を与える」テクニックはすぐに試してみたいです！",
    },
    {
      author: { name: "佐藤 美咲", avatar: "/images/avatars/avatar-03.jpg", initials: "佐藤" },
      datetime: "2024/05/11 09:15",
      body: "PoCの進め方が具体的で助かりました。小さく始める重要性を改めて実感しました。",
    },
  ],
};

const cloudArticleDetail: ContentDetail = {
  viewCount: 982,
  publishedDate: "2024/05/06",
  updatedDate: "2024/05/09",
  summary: {
    title: "この記事の要点",
    body: "可用性とスケーラビリティを両立するクラウドインフラ設計の基礎を、6つの観点で整理します。要件定義から運用監視までを一気通貫で押さえましょう。",
  },
  sections: [
    {
      id: "overview",
      heading: "概要",
      paragraphs: [
        "クラウドインフラ設計では、コスト・可用性・運用性のバランスが重要です。本記事では、ゼロから設計を始めるための判断軸を、具体的なステップに分けて解説します。",
      ],
    },
    {
      id: "introduction",
      heading: "設計のポイント",
      paragraphs: [
        "まずは非機能要件を明確にすることから始めます。想定するトラフィックや障害許容度を定義し、過剰設計を避けながら必要十分な構成を選びましょう。",
      ],
      callout: {
        title: "ポイント",
        body: "SLO を先に決めることで、冗長化や監視の粒度を合理的に判断できます。",
      },
    },
  ],
  steps: [
    { title: "要件定義", description: "可用性・性能・コストの目標値を定義する" },
    { title: "ネットワーク設計", description: "VPC とサブネット、通信経路を設計する" },
    { title: "コンピュート選定", description: "ワークロードに合う実行基盤を選ぶ" },
    { title: "データ層設計", description: "永続化とバックアップ戦略を決める" },
    { title: "セキュリティ", description: "最小権限と境界防御を組み込む" },
    { title: "監視と運用", description: "メトリクスとアラートで継続運用する" },
  ],
  conclusion:
    "堅牢なインフラは、要件から運用まで一貫した設計判断の積み重ねで生まれます。小さく作って計測し、段階的に最適化していきましょう。",
  cycleLabel: "クラウド設計のサイクル",
  toc: [
    { id: "overview", label: "概要" },
    { id: "introduction", label: "設計のポイント" },
    {
      id: "steps",
      label: "設計の6ステップ",
      children: [
        { label: "要件定義" },
        { label: "ネットワーク設計" },
        { label: "コンピュート選定" },
        { label: "データ層設計" },
        { label: "セキュリティ" },
        { label: "監視と運用" },
      ],
    },
    { id: "conclusion", label: "まとめ" },
  ],
  comments: [
    {
      author: { name: "高橋 直樹", avatar: "/images/avatars/avatar-03.jpg", initials: "高橋" },
      datetime: "2024/05/07 14:02",
      body: "SLO を起点に考える視点が腹落ちしました。早速チームの設計レビューに取り入れます。",
    },
  ],
};

const jsArticleDetail: ContentDetail = {
  viewCount: 1543,
  publishedDate: "2024/05/02",
  updatedDate: "2024/05/05",
  summary: {
    title: "この記事の要点",
    body: "モダンJavaScript開発の全体像を、ツールチェーンとフレームワーク選定の観点から俯瞰します。技術選定の判断軸を6つの視点で整理しました。",
  },
  sections: [
    {
      id: "overview",
      heading: "概要",
      paragraphs: [
        "フロントエンド開発は選択肢が多く、技術選定そのものが難しい領域です。本記事では、最新動向を踏まえた判断の指針を、実務目線で整理します。",
      ],
    },
    {
      id: "introduction",
      heading: "選定のポイント",
      paragraphs: [
        "流行ではなく、チームの習熟度とプロダクト要件から逆算して選ぶことが重要です。学習コストと長期的な保守性を天秤にかけましょう。",
      ],
      callout: {
        title: "ポイント",
        body: "エコシステムの成熟度と採用事例は、長期運用のリスクを測る良い指標です。",
      },
    },
  ],
  steps: [
    { title: "要件の整理", description: "SPA か SSR か、要件から方式を決める" },
    { title: "フレームワーク選定", description: "チームに合う基盤を選ぶ" },
    { title: "ビルドツール", description: "開発体験とビルド速度で選ぶ" },
    { title: "型システム", description: "TypeScript で堅牢性を高める" },
    { title: "テスト戦略", description: "ユニットから E2E までを設計する" },
    { title: "継続的改善", description: "計測しながらリファクタを重ねる" },
  ],
  conclusion:
    "ツールは目的ではなく手段です。プロダクトとチームに最適な構成を、計測しながら選び続けていきましょう。",
  cycleLabel: "技術選定のサイクル",
  toc: [
    { id: "overview", label: "概要" },
    { id: "introduction", label: "選定のポイント" },
    {
      id: "steps",
      label: "選定の6ステップ",
      children: [
        { label: "要件の整理" },
        { label: "フレームワーク選定" },
        { label: "ビルドツール" },
        { label: "型システム" },
        { label: "テスト戦略" },
        { label: "継続的改善" },
      ],
    },
    { id: "conclusion", label: "まとめ" },
  ],
  comments: [
    {
      author: { name: "中村 拓也", avatar: "/images/avatars/avatar-02.jpg", initials: "中村" },
      datetime: "2024/05/03 09:40",
      body: "選定の判断軸が言語化されていて助かりました。チーム内の議論のたたき台に使います。",
    },
  ],
};

const memberOnlyBlueprintDetail: ContentDetail = {
  viewCount: 321,
  publishedDate: "2024/05/18",
  updatedDate: "2024/05/19",
  summary: {
    title: "この記事の要点",
    body: "会員限定コンテンツの URL 到達条件と本文閲覧条件を分け、公開カタログから認証必須詳細へ安全につなぐ設計を整理します。",
  },
  sections: [
    {
      id: "overview",
      heading: "概要",
      paragraphs: [
        "このブループリントでは、コンテンツ詳細 URL 自体をログイン必須にしつつ、本文 full detail はプラン条件でさらに制御する構成を扱います。",
      ],
    },
    {
      id: "guard-design",
      heading: "ガード設計",
      paragraphs: [
        "Proxy は軽量 manifest による早期 redirect だけを担当し、Server Component と API 境界で同じ条件を再確認します。",
      ],
      callout: {
        title: "設計ポイント",
        body: "URL 到達条件と本文閲覧条件を分けることで、公開 preview と会員限定本文の責務が明確になります。",
      },
    },
  ],
  steps: [
    { title: "URL 条件を定義", description: "routeAccessPolicy で匿名到達可否を表す" },
    { title: "本文条件を維持", description: "accessPolicy で full detail の閲覧条件を判定する" },
    { title: "Proxy を軽量化", description: "静的 manifest と cookie 状態だけで早期 redirect する" },
    { title: "Server で再確認", description: "ページと API で同じ方針を再チェックする" },
    { title: "detail を遅延取得", description: "allowed 後にだけ本文データを取得する" },
    { title: "テストで固定", description: "匿名・無料・プレミアム・admin の差分を検証する" },
  ],
  conclusion:
    "routeAccessPolicy と accessPolicy を分離すると、URL 保護と本文保護をそれぞれ独立して拡張できます。",
  cycleLabel: "会員限定アクセス設計のサイクル",
  toc: [
    { id: "overview", label: "概要" },
    { id: "guard-design", label: "ガード設計" },
    {
      id: "steps",
      label: "6つの確認ポイント",
      children: [
        { label: "URL 条件を定義" },
        { label: "本文条件を維持" },
        { label: "Proxy を軽量化" },
        { label: "Server で再確認" },
        { label: "detail を遅延取得" },
        { label: "テストで固定" },
      ],
    },
    { id: "conclusion", label: "まとめ" },
  ],
  comments: [],
};

/**
 * 記事 id をキーにした詳細モックデータ。デザイン原稿に一致する `id: "1"` を中心に、
 * 一覧の記事（id 4 / 7）と会員限定検証用記事にも本文を用意し、カードや直リンクを機能させる。
 */
export const mockContentDetails: Record<string, ContentDetail> = {
  "1": aiArticleDetail,
  "4": cloudArticleDetail,
  "7": jsArticleDetail,
  "member-only-blueprint": memberOnlyBlueprintDetail,
};
