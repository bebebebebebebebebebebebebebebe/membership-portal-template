import { notFound } from "next/navigation";

import { ContentAccessGate } from "@/features/contents/components/content-access-gate";
import { ArticleDetail } from "@/features/contents/components/detail/article-detail";
import {
  getAuthorizedContentDetail,
  getPublicContentPreview,
  getPublicRelatedContents,
} from "@/features/contents/server/content-read-queries";
import type { ArticleContent } from "@/features/contents/types/content";
import type { ContentViewer } from "@/features/contents/types/content-viewer";
import { canViewContent } from "@/features/contents/utils/content-access";

/**
 * 認証済み viewer に合わせて本文または Content Gate を返す Server Component。
 *
 * full body は accessPolicy allowed のときだけ `getAuthorizedContentDetail` で取得し、
 * denied や認可 forbidden では本文を取得せず Content Gate（preview のみ）を返す。
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
    return (
      <ContentAccessGate
        content={content}
        preview={await getPublicContentPreview(id)}
        reason={decision.reason}
      />
    );
  }

  const result = await getAuthorizedContentDetail(id, viewer);

  if (result.status === "notFound") {
    notFound();
  }

  if (result.status === "forbidden") {
    return (
      <ContentAccessGate
        content={content}
        preview={await getPublicContentPreview(id)}
        reason="loginRequired"
      />
    );
  }

  const related = await getPublicRelatedContents(id);

  return (
    <ArticleDetail
      content={content}
      detail={result.detail}
      related={related}
      currentUser={viewer.user}
    />
  );
}
