/**
 * コンテンツ詳細 URL 自体の到達条件。
 *
 * 本文 full detail の閲覧条件は `ContentAccessPolicy` が担当し、この型は
 * `/contents/[id]` を匿名ユーザーに開かせるかだけを表す。
 */
export type ContentRouteAccessPolicy =
  | { kind: "public" }
  | { kind: "loginRequired" };

/** Proxy manifest と route 判定で使う URL 到達条件の種別。 */
export type ContentRouteAccessKind = ContentRouteAccessPolicy["kind"];
