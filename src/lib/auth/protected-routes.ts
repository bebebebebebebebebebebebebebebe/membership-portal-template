const memberProtectedRoutePrefixes = [
  "/dashboard",
  "/bookmarks",
  "/notifications",
  "/settings",
] as const;

/**
 * Member Zone としてログイン必須にする route かを判定する。
 *
 * `/contents` は Public Zone の公開条件付きカタログなので対象に含めない。
 *
 * @param pathname 判定対象の URL path。
 * @returns Member Zone の保護対象なら `true`。
 */
export function isMemberProtectedRoute(pathname: string): boolean {
  return memberProtectedRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
