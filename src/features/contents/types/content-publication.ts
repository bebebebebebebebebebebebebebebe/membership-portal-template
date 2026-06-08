/**
 * コンテンツ本文が公開ライフサイクル上どの状態にあるかを表す。
 *
 * 一覧に出すかどうかは Discoverability で別に扱う。
 */
export type PublicationStatus =
  | "draft"
  | "scheduled"
  | "published"
  | "archived";

/**
 * 公開済みコンテンツを利用者が発見できる範囲。
 *
 * 公開状態とは独立させ、URL 直アクセス可能だが一覧には出さない状態を表現できる。
 */
export type Discoverability = "listed" | "unlisted" | "hidden";
