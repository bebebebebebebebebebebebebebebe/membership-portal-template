const DEFAULT_MEMBER_AFTER_LOGIN_PATH = "/dashboard";

/**
 * login 後に戻す internal path を安全な値へ正規化する。
 *
 * 外部 URL や protocol-relative URL は open redirect につながるため、既定の
 * Member Zone 入口にフォールバックする。
 *
 * @param value 検証対象の next path。
 * @returns 内部遷移として安全に扱える path。
 */
export function normalizeInternalNextPath(
  value: string | null | undefined
): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_MEMBER_AFTER_LOGIN_PATH;
  }

  return value;
}

/**
 * login route への redirect path を生成する。
 *
 * @param nextPath login 後に戻したい内部 path。
 * @returns URL encode 済みの `next` を含む login path。
 */
export function createLoginRedirectPath(nextPath: string): string {
  const safeNextPath = normalizeInternalNextPath(nextPath);

  return `/login?next=${encodeURIComponent(safeNextPath)}`;
}
