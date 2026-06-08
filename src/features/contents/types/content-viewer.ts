import type { MembershipPlan } from "@/features/contents/types/content-access";
import type { AuthUser } from "@/types/auth";

/**
 * コンテンツ閲覧判定に必要な閲覧者情報。
 *
 * AuthUser の membership は表示ラベルとして扱い、判定では正規化済みの plan を使う。
 */
export type ContentViewer = {
  user: AuthUser | null;
  plan: MembershipPlan | null;
  purchasedProductIds: string[];
};
