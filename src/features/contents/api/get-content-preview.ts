import { getContentMetadata } from "@/features/contents/api/get-content-metadata";
import type { ContentPreview } from "@/features/contents/types/content-preview";

/**
 * 閲覧不可ユーザーにも表示してよいコンテンツ概要を返す。
 *
 * full body や comments などの詳細データには触れず、metadata 由来の説明文だけを使う。
 *
 * @param id 取得対象のコンテンツ ID。
 * @returns gate 表示用の概要。存在しない場合は undefined。
 */
export function getContentPreview(id: string): ContentPreview | undefined {
  const content = getContentMetadata(id);

  if (!content) {
    return undefined;
  }

  return {
    id: content.id,
    introduction: content.description,
  };
}
