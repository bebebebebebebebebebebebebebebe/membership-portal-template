import { describe, expect, it } from "vitest";

import { getContentPreview } from "@/features/contents/api/get-content-preview";
import { getProductOffer } from "@/features/contents/api/get-product-offer";
import type { ContentAccessPolicy } from "@/features/contents/types/content-access";
import type { ContentViewer } from "@/features/contents/types/content-viewer";
import { canViewContent } from "@/features/contents/utils/content-access";

const anonymousViewer: ContentViewer = {
  user: null,
  plan: null,
  purchasedProductIds: [],
};

const loggedInViewer: ContentViewer = {
  user: {
    name: "一般 会員",
    email: "member@example.com",
    avatar: "/images/avatars/avatar-01.jpg",
    initials: "一般",
    membership: "無料会員",
    role: "member",
  },
  plan: "free",
  purchasedProductIds: [],
};

const premiumViewer: ContentViewer = {
  ...loggedInViewer,
  plan: "premium",
};

const purchasedViewer: ContentViewer = {
  ...loggedInViewer,
  purchasedProductIds: ["product-security-checklist"],
};

const adminViewer: ContentViewer = {
  user: {
    ...loggedInViewer.user!,
    role: "admin",
  },
  plan: null,
  purchasedProductIds: [],
};

describe("canViewContent", () => {
  it("allows free content for anonymous viewers", () => {
    expect(canViewContent({ kind: "free" }, anonymousViewer)).toEqual({
      allowed: true,
      reason: "free",
    });
  });

  it("denies loginRequired content for anonymous viewers", () => {
    expect(canViewContent({ kind: "loginRequired" }, anonymousViewer)).toEqual({
      allowed: false,
      reason: "loginRequired",
    });
  });

  it("allows loginRequired content for logged-in viewers", () => {
    expect(canViewContent({ kind: "loginRequired" }, loggedInViewer)).toEqual({
      allowed: true,
      reason: "authenticated",
    });
  });

  it("denies planRequired content when the viewer plan does not match", () => {
    expect(
      canViewContent(
        { kind: "planRequired", requiredPlans: ["premium"] },
        loggedInViewer
      )
    ).toEqual({
      allowed: false,
      reason: "planRequired",
    });
  });

  it("allows planRequired content when the viewer plan matches", () => {
    expect(
      canViewContent(
        { kind: "planRequired", requiredPlans: ["premium"] },
        premiumViewer
      )
    ).toEqual({
      allowed: true,
      reason: "planMatched",
    });
  });

  it("denies purchaseRequired content when the viewer has not purchased it", () => {
    expect(
      canViewContent(
        {
          kind: "purchaseRequired",
          productId: "product-security-checklist",
        },
        loggedInViewer
      )
    ).toEqual({
      allowed: false,
      reason: "purchaseRequired",
    });
  });

  it("allows purchaseRequired content when the viewer has purchased it", () => {
    expect(
      canViewContent(
        {
          kind: "purchaseRequired",
          productId: "product-security-checklist",
        },
        purchasedViewer
      )
    ).toEqual({
      allowed: true,
      reason: "purchased",
    });
  });

  it("allows planOrPurchase content when the viewer plan matches", () => {
    expect(
      canViewContent(
        {
          kind: "planOrPurchase",
          requiredPlans: ["standard", "premium"],
          productId: "product-modern-javascript",
        },
        premiumViewer
      )
    ).toEqual({
      allowed: true,
      reason: "planMatched",
    });
  });

  it("allows planOrPurchase content when the viewer has purchased it", () => {
    expect(
      canViewContent(
        {
          kind: "planOrPurchase",
          requiredPlans: ["standard", "premium"],
          productId: "product-security-checklist",
        },
        purchasedViewer
      )
    ).toEqual({
      allowed: true,
      reason: "purchased",
    });
  });

  it("allows any content for admin viewers", () => {
    const policies: ContentAccessPolicy[] = [
      { kind: "free" },
      { kind: "loginRequired" },
      { kind: "planRequired", requiredPlans: ["premium"] },
      {
        kind: "purchaseRequired",
        productId: "product-security-checklist",
      },
      {
        kind: "planOrPurchase",
        requiredPlans: ["standard", "premium"],
        productId: "product-modern-javascript",
      },
    ];

    expect(
      policies.map((policy) => canViewContent(policy, adminViewer))
    ).toEqual(
      policies.map(() => ({
        allowed: true,
        reason: "admin",
      }))
    );
  });
});

describe("content data boundaries", () => {
  it("returns preview data without full detail fields", async () => {
    const preview = await getContentPreview("1");

    expect(preview).toEqual({
      id: "1",
      introduction:
        "ログイン不要で全文を閲覧できる公開コンテンツです。free アクセスの基本動作を確認できます。",
    });
    expect(preview).not.toHaveProperty("sections");
    expect(preview).not.toHaveProperty("steps");
    expect(preview).not.toHaveProperty("comments");
    expect(preview).not.toHaveProperty("conclusion");
  });

  it("returns pricing from product offers instead of access policies", async () => {
    await expect(getProductOffer("product-security-checklist")).resolves.toMatchObject({
      productId: "product-security-checklist",
      price: 1980,
      currency: "JPY",
      taxIncluded: true,
      available: true,
    });
  });
});
