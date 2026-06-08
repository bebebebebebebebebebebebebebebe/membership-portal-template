import { getCurrentUser } from "@/lib/auth/get-current-user";
import type { MembershipPlan } from "@/features/contents/types/content-access";
import type { ContentViewer } from "@/features/contents/types/content-viewer";

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
  const user = await getCurrentUser();

  return {
    user,
    plan: toMembershipPlan(user?.membership),
    purchasedProductIds: [],
  };
}
