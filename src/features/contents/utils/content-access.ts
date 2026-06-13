import type { ContentAccessPolicy } from "@/features/contents/types/content-access";
import type { ContentViewer } from "@/features/contents/types/content-viewer";

/**
 * コンテンツ閲覧判定の結果。
 *
 * UI は allowed と reason を見て、全文表示・ログイン導線・購入導線などを選択する。
 */
export type ContentAccessDecision =
  | {
      allowed: true;
      reason: "free" | "authenticated" | "planMatched" | "purchased" | "admin";
    }
  | {
      allowed: false;
      reason:
        | "loginRequired"
        | "planRequired"
        | "purchaseRequired"
        | "planOrPurchaseRequired";
    };

/**
 * コンテンツ単位の閲覧可否を判定する。
 *
 * @param policy コンテンツに設定された閲覧条件。
 * @param viewer サーバー側で導出した閲覧者状態。
 * @returns 閲覧可否と、UI 分岐で使う理由。
 */
export function canViewContent(
  policy: ContentAccessPolicy,
  viewer: ContentViewer
): ContentAccessDecision {
  if (viewer.user?.role === "admin") {
    return { allowed: true, reason: "admin" };
  }

  switch (policy.kind) {
    case "free":
      return { allowed: true, reason: "free" };

    case "loginRequired":
      return viewer.user
        ? { allowed: true, reason: "authenticated" }
        : { allowed: false, reason: "loginRequired" };

    case "planRequired":
      return viewer.plan && policy.requiredPlans.includes(viewer.plan)
        ? { allowed: true, reason: "planMatched" }
        : { allowed: false, reason: "planRequired" };

    case "purchaseRequired":
      return viewer.purchasedProductIds.includes(policy.productId)
        ? { allowed: true, reason: "purchased" }
        : { allowed: false, reason: "purchaseRequired" };

    case "planOrPurchase":
      if (viewer.plan && policy.requiredPlans.includes(viewer.plan)) {
        return { allowed: true, reason: "planMatched" };
      }

      return viewer.purchasedProductIds.includes(policy.productId)
        ? { allowed: true, reason: "purchased" }
        : { allowed: false, reason: "planOrPurchaseRequired" };
  }
}
