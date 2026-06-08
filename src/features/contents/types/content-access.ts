/**
 * コンテンツ閲覧条件で利用する会員プラン。
 *
 * MVP では無料・標準・プレミアムの 3 段階に限定し、より細かな権限は
 * 将来の entitlement モデルで扱う。
 */
export type MembershipPlan = "free" | "standard" | "premium";

/**
 * コンテンツ本文を閲覧するために必要な条件の種別。
 *
 * UI 表示文言や販売価格は含めず、閲覧可否判定に必要な分類だけを表す。
 */
export type ContentAccessKind =
  | "free"
  | "loginRequired"
  | "planRequired"
  | "purchaseRequired"
  | "planOrPurchase";

/**
 * コンテンツ単位の閲覧条件。
 *
 * `label` は表示用定数、`price` は ProductOffer に分離し、この型には
 * アクセス判定に必要な最小情報だけを持たせる。
 */
export type ContentAccessPolicy =
  | { kind: "free" }
  | { kind: "loginRequired" }
  | { kind: "planRequired"; requiredPlans: MembershipPlan[] }
  | { kind: "purchaseRequired"; productId: string }
  | {
      kind: "planOrPurchase";
      requiredPlans: MembershipPlan[];
      productId: string;
    };
