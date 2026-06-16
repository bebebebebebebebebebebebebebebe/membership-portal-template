import { getContentRouteAccessKindForProxy } from "@/config/content-route-access-manifest";

const memberProtectedRoutePrefixes = [
  "/dashboard",
  "/bookmarks",
  "/notifications",
  "/settings",
] as const;

function getContentIdFromPathname(pathname: string): string | null {
  const match = pathname.match(/^\/contents\/([^/]+)$/);

  if (!match?.[1]) {
    return null;
  }

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

/**
 * Member Zone または content 単位のログイン必須 route かを判定する。
 *
 * `/contents` 一覧は Public Zone の公開カタログなので対象に含めない。
 * `/contents/[id]` は Proxy 用 manifest に登録された ID だけを保護対象にする。
 *
 * @param pathname 判定対象の URL path。
 * @returns ログイン必須 route なら `true`。
 */
export function isMemberProtectedRoute(pathname: string): boolean {
  if (
    memberProtectedRoutePrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )
  ) {
    return true;
  }

  const contentId = getContentIdFromPathname(pathname);

  if (!contentId) {
    return false;
  }

  return getContentRouteAccessKindForProxy(contentId) === "loginRequired";
}
