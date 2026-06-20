const DEFAULT_LOCAL_ORIGIN = "http://localhost:3000";

/**
 * アプリ内 API の origin を実行環境から解決する。
 *
 * ブラウザでは現在の location、サーバーでは明示された公開 URL、Vercel URL、
 * ローカルの PORT の順に使う。Server Component の `fetch()` で相対 URL を
 * 渡さないための境界 helper。
 *
 * @returns `/api` への fetch で使う origin。
 */
export function getApiOrigin(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const configuredOrigin =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL;

  if (configuredOrigin) {
    return configuredOrigin;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.PORT) {
    return `http://localhost:${process.env.PORT}`;
  }

  return DEFAULT_LOCAL_ORIGIN;
}

/**
 * アプリ内 API の絶対 URL を作る。
 *
 * @param path - `/api` から始まる API path。
 * @returns 実行環境に合わせた絶対 URL。
 */
export function createApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return new URL(normalizedPath, getApiOrigin()).toString();
}
