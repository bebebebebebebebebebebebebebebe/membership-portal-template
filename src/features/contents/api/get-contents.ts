import type { Content } from "@/features/contents/types/content";
import { fetchJson, fetchOptionalJson } from "@/lib/api/fetch-json";

/**
 * 一覧（カタログ）に掲載するコンテンツを取得する。
 *
 * mock data の所在を直接 import せず、HTTP API 境界から取得する。
 *
 * @returns 掲載対象のコンテンツ一覧。
 */
export async function getContents(): Promise<Content[]> {
  return fetchJson<Content[]>("/api/contents");
}

/**
 * id に一致するコンテンツ metadata を取得する。
 *
 * @param id コンテンツ id。
 * @returns 一致するコンテンツ。存在しなければ `undefined`。
 */
export async function getContentById(id: string): Promise<Content | undefined> {
  return fetchOptionalJson<Content>(
    `/api/contents/${encodeURIComponent(id)}/metadata`
  );
}

/**
 * 指定 id を除外した関連コンテンツを取得する。
 *
 * @param id 現在表示中のコンテンツ id。
 * @param limit 返却件数の上限。
 * @returns 関連コンテンツ一覧。
 */
export async function getRelatedContents(
  id: string,
  limit = 4
): Promise<Content[]> {
  return fetchJson<Content[]>(
    `/api/contents/${encodeURIComponent(id)}/related?limit=${limit}`
  );
}
