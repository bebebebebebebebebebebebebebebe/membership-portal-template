import "server-only";

import type { MembershipPlan } from "@/features/contents/types/content-access";
import type { ContentViewer } from "@/features/contents/types/content-viewer";
import { getCurrentAuthState } from "@/lib/auth/get-current-auth-state";

function toMembershipPlan(membership: string | undefined): MembershipPlan | null {
  switch (membership) {
    case "プレミアム会員":
      return "premium";
    case "スタンダード会員":
      return "standard";
    case "無料会員":
      return "free";
    default:
      return null;
  }
}

/**
 * コンテンツ閲覧判定用の viewer をサーバー側の認証状態から組み立てる。
 *
 * @returns 正規化済みの会員プランと購入済み productId を含む閲覧者情報。
 */
export async function getContentViewer(): Promise<ContentViewer> {
  const authState = await getCurrentAuthState();

  return {
    user: authState.user,
    plan: toMembershipPlan(authState.user?.membership),
    purchasedProductIds: authState.purchasedProductIds,
  };
}
