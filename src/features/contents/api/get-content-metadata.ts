import type { Content } from "@/features/contents/types/content";
import { fetchOptionalJson } from "@/lib/api/fetch-json";

/**
 * 認可判定前に取得できるコンテンツメタデータを取得する。
 *
 * @param id - 取得対象のコンテンツ ID。
 * @returns 一覧表示相当の安全なメタデータ。存在しない場合は undefined。
 */
export async function getContentMetadata(
  id: string
): Promise<Content | undefined> {
  return fetchOptionalJson<Content>(
    `/api/contents/${encodeURIComponent(id)}/metadata`
  );
}
