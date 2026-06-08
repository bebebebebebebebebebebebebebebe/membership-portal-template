import { mockContents } from "@/features/contents/data/mock-contents";
import type { Content } from "@/features/contents/types/content";

/**
 * 認可判定前に取得できるコンテンツメタデータを返す。
 *
 * @param id 取得対象のコンテンツ ID。
 * @returns 一覧表示相当の安全なメタデータ。存在しない場合は undefined。
 */
export function getContentMetadata(id: string): Content | undefined {
  return mockContents.find((item) => item.id === id);
}
