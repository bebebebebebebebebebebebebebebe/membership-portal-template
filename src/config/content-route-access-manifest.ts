export type ProxyContentRouteAccessKind = "public" | "loginRequired";

const contentRouteAccessManifest = {
  "member-only-blueprint": "loginRequired",
} as const satisfies Record<string, ProxyContentRouteAccessKind>;

/**
 * Proxy で使うコンテンツ詳細 URL の軽量到達条件を返す。
 *
 * Proxy では DB や repository を読まず、この静的 manifest だけで匿名ユーザーの
 * 早期 redirect 可否を判断する。未登録 ID は公開 URL として扱う。
 *
 * @param contentId - `/contents/[id]` の content id。
 * @returns Proxy で使う URL 到達条件。
 */
export function getContentRouteAccessKindForProxy(
  contentId: string
): ProxyContentRouteAccessKind {
  return (
    contentRouteAccessManifest[
      contentId as keyof typeof contentRouteAccessManifest
    ] ?? "public"
  );
}
