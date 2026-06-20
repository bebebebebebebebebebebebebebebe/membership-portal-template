import { redirect } from "next/navigation";

import { getContentViewer } from "@/features/contents/server/content-viewer";
import { PersonalizedContentAccess } from "@/features/contents/components/detail/personalized-content-access";
import type { ArticleContent } from "@/features/contents/types/content";
import { canAccessContentRoute } from "@/features/contents/utils/content-route-access";
import { createLoginRedirectPath } from "@/lib/auth/auth-redirect";

export type ContentRouteGuardSlotProps = {
  id: string;
  content: ArticleContent;
};

/**
 * `/contents/[id]` の URL 到達条件を最終確認する Server Component。
 *
 * Proxy の早期 redirect を通過しても、Server Component 側で viewer を取得して
 * `routeAccessPolicy` を再確認する。
 *
 * @param props - コンテンツ ID と、認可前に取得済みの記事 metadata。
 * @returns route access 通過後の personalized content。
 */
export async function ContentRouteGuardSlot(props: ContentRouteGuardSlotProps) {
  const { id, content } = props;

  const viewer = await getContentViewer();
  const routeDecision = canAccessContentRoute(
    content.routeAccessPolicy,
    viewer.user
  );

  if (!routeDecision.allowed) {
    redirect(createLoginRedirectPath(`/contents/${encodeURIComponent(id)}`));
  }

  return (
    <PersonalizedContentAccess id={id} content={content} viewer={viewer} />
  );
}
