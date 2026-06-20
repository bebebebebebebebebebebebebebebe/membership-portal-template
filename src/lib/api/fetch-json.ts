import { createApiUrl } from "@/lib/api/api-url";

/**
 * JSON API が 2xx 以外を返したときのエラー。
 *
 * @param message - エラー概要。
 * @param status - HTTP status code。
 * @param statusText - HTTP status text。
 */
export class FetchJsonError extends Error {
  status: number;
  statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.name = "FetchJsonError";
    this.status = status;
    this.statusText = statusText;
  }
}

/**
 * アプリ内 JSON API を取得する。
 *
 * 404 を含む非 2xx は `FetchJsonError` として呼び出し側に渡す。
 *
 * @param path - `/api` から始まる API path。
 * @param init - `fetch` に渡す追加 options。
 * @returns JSON として parse したレスポンス。
 * @throws `fetch` 失敗または非 2xx レスポンス。
 */
export async function fetchJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(createApiUrl(path), {
    cache: "no-store",
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new FetchJsonError(
      `Request failed: ${path}`,
      response.status,
      response.statusText
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/**
 * 404 を `undefined` として扱う JSON API helper。
 *
 * @param path - `/api` から始まる API path。
 * @param init - `fetch` に渡す追加 options。
 * @returns JSON として parse したレスポンス。404 の場合は `undefined`。
 * @throws 404 以外の非 2xx レスポンス。
 */
export async function fetchOptionalJson<T>(
  path: string,
  init?: RequestInit
): Promise<T | undefined> {
  try {
    return await fetchJson<T>(path, init);
  } catch (error) {
    if (error instanceof FetchJsonError && error.status === 404) {
      return undefined;
    }

    throw error;
  }
}
