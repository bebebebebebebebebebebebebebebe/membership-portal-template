/**
 * コメント投稿者。
 *
 * アバター画像の読み込みに失敗した場合は `initials` を Avatar fallback に表示する。
 */
export type CommentAuthor = {
  name: string;
  avatar: string;
  initials: string;
};

/** 本文の 1 セクション（概要・導入のポイントなど）。 */
export type ArticleSection = {
  /** 目次リンク・スクロールアンカー用の id（例: "overview"）。 */
  id: string;
  heading: string;
  paragraphs: string[];
  /** セクション内に置く強調コールアウト（「ポイント」ボックス）。任意。 */
  callout?: { title: string; body: string };
};

/** 「6つのステップ」リストの 1 項目。 */
export type ArticleStep = {
  title: string;
  description: string;
};

/** 目次の 1 項目。`children` を持つ場合はネストした番号付きサブ項目を描画する。 */
export type TocItem = {
  /** 対応するセクション/ブロックのアンカー id。 */
  id: string;
  label: string;
  children?: { label: string }[];
};

/** 記事へのコメント 1 件。 */
export type ArticleComment = {
  author: CommentAuthor;
  /** 表示用の投稿日時（例: "2024/05/11 10:23"）。 */
  datetime: string;
  body: string;
};

/**
 * 記事詳細の本文・統計・目次・コメント。
 *
 * 一覧の Content と `id` で対応づけ、詳細ページで両者を結合して描画する。
 */
export type ContentDetail = {
  /** 閲覧数（メタ行・「この記事について」で表示）。 */
  viewCount: number;
  /** 公開日。 */
  publishedDate: string;
  /** 更新日。 */
  updatedDate: string;
  /** 冒頭の「この記事の要点」コールアウト。 */
  summary: { title: string; body: string };
  /** 「6つのステップ」ブロックの直前までに並ぶ本文セクション。 */
  sections: ArticleSection[];
  /** 「6つのステップ」見出しの直下に表示する番号付きリスト＋サイクル図の元データ。 */
  steps: ArticleStep[];
  /** ステップ群の後に置く「まとめ」本文。 */
  conclusion: string;
  /** サイクル図の中央に表示するラベル（例: "生成AI活用のサイクル"）。 */
  cycleLabel: string;
  /** 右レール「目次」の項目。 */
  toc: TocItem[];
  /** コメント一覧。 */
  comments: ArticleComment[];
};
