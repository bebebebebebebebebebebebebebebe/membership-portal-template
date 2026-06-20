import type { ContentPreview } from "@/features/contents/types/content-preview";
import { fetchOptionalJson } from "@/lib/api/fetch-json";

/**
 * 閲覧不可ユーザーにも表示してよいコンテンツ概要を取得する。
 *
 * full body や comments などの詳細データには触れず、HTTP API 境界から
 * metadata 由来の説明文だけを受け取る。
 *
 * @param id - 取得対象のコンテンツ ID。
 * @returns gate 表示用の概要。存在しない場合は undefined。
 */
export async function getContentPreview(
  id: string
): Promise<ContentPreview | undefined> {
  return fetchOptionalJson<ContentPreview>(
    `/api/contents/${encodeURIComponent(id)}/preview`
  );
}
