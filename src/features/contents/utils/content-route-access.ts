import type { ContentRouteAccessPolicy } from "@/features/contents/types/content-route-access";
import type { AuthUser } from "@/types/auth";

/** コンテンツ詳細 URL への到達可否判定結果。 */
export type ContentRouteAccessDecision =
  | { allowed: true; reason: "public" | "authenticated" }
  | { allowed: false; reason: "loginRequired" };

/**
 * `/contents/[id]` の URL 自体へ到達できるかを判定する。
 *
 * 本文の閲覧可否や購入状態は見ず、匿名か認証済みかだけで判定する。
 *
 * @param policy - コンテンツ詳細 URL の到達条件。
 * @param user - 現在の認証済みユーザー。匿名の場合は `null`。
 * @returns URL への到達可否と、その理由。
 */
export function canAccessContentRoute(
  policy: ContentRouteAccessPolicy,
  user: AuthUser | null
): ContentRouteAccessDecision {
  switch (policy.kind) {
    case "public":
      return { allowed: true, reason: "public" };
    case "loginRequired":
      return user
        ? { allowed: true, reason: "authenticated" }
        : { allowed: false, reason: "loginRequired" };
  }
}
