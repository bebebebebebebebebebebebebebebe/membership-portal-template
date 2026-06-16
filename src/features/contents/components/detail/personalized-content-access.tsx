import { notFound } from "next/navigation";

import { getContentDetail } from "@/features/contents/api/get-content-detail";
import { getContentPreview } from "@/features/contents/api/get-content-preview";
import { getRelatedContents } from "@/features/contents/api/get-contents";
import { ContentAccessGate } from "@/features/contents/components/content-access-gate";
import { ArticleDetail } from "@/features/contents/components/detail/article-detail";
import type { ArticleContent } from "@/features/contents/types/content";
import type { ContentViewer } from "@/features/contents/types/content-viewer";
import { canViewContent } from "@/features/contents/utils/content-access";

/**
 * 認証済み viewer に合わせて本文または Content Gate を返す Server Component。
 *
 * @param id コンテンツ ID。
 * @param content 認可前に取得済みの記事 metadata。
 * @param viewer route guard を通過した閲覧者状態。
 * @returns 本文詳細、または本文を含まない Content Gate。
 */
export async function PersonalizedContentAccess({
  id,
  content,
  viewer,
}: {
  id: string;
  content: ArticleContent;
  viewer: ContentViewer;
}) {
  const decision = canViewContent(content.accessPolicy, viewer);

  if (!decision.allowed) {
    return ContentAccessGate({
      content,
      preview: await getContentPreview(id),
      reason: decision.reason,
    });
  }

  const detail = await getContentDetail(id);

  if (!detail) {
    notFound();
  }

  const related = await getRelatedContents(id);

  return (
    <ArticleDetail
      content={content}
      detail={detail}
      related={related}
      currentUser={viewer.user}
    />
  );
}
