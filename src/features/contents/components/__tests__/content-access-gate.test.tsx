import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContentAccessGate } from "@/features/contents/components/content-access-gate";
import type { Content } from "@/features/contents/types/content";
import type { ContentAccessPolicy } from "@/features/contents/types/content-access";

/**
 * accessPolicy だけを差し替えた汎用コンテンツ fixture。
 * 購入系の価格は ContentPurchaseCta 内部の getProductOffer() に依存するため、
 * 実在する mock productId を指す policy を渡す。
 */
function makeContent(accessPolicy: ContentAccessPolicy): Content {
  return {
    id: "fixture",
    title: "サンプルコンテンツ",
    description: "説明文",
    thumbnail: "/images/contents/sample.png",
    tags: ["タグ"],
    publicationStatus: "published",
    discoverability: "listed",
    routeAccessPolicy: { kind: "public" },
    accessPolicy,
  };
}

describe("ContentAccessGate", () => {
  it("loginRequired はログイン導線を表示する", async () => {
    render(
      await ContentAccessGate({
        content: makeContent({ kind: "loginRequired" }),
        reason: "loginRequired",
      })
    );

    expect(screen.getByText("ログインが必要です")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "ログインして見る" })
    ).toHaveAttribute("href", "/login");
  });

  it("planRequired はプラン確認導線を表示する", async () => {
    render(
      await ContentAccessGate({
        content: makeContent({
          kind: "planRequired",
          requiredPlans: ["premium"],
        }),
        reason: "planRequired",
      })
    );

    expect(screen.getByText("対象プランへの加入が必要です")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "プランを確認" })).toHaveAttribute(
      "href",
      "/pricing"
    );
  });

  it("purchaseRequired は ProductOffer 価格の購入導線を表示する", async () => {
    render(
      await ContentAccessGate({
        content: makeContent({
          kind: "purchaseRequired",
          productId: "product-security-checklist",
        }),
        reason: "purchaseRequired",
      })
    );

    expect(screen.getByText("単品購入で閲覧できます")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "1,980円で購入する" })
    ).toHaveAttribute("href", "/contents/purchase/product-security-checklist");
  });

  it("planOrPurchaseRequired は購入とプランの両導線を表示する", async () => {
    render(
      await ContentAccessGate({
        content: makeContent({
          kind: "planOrPurchase",
          requiredPlans: ["standard", "premium"],
          productId: "product-modern-javascript",
        }),
        reason: "planOrPurchaseRequired",
      })
    );

    expect(
      screen.getByText("プラン加入または単品購入で閲覧できます")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "2,480円で購入する" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "プランを確認" })).toHaveAttribute(
      "href",
      "/pricing"
    );
  });

  it("preview があるときだけ概要を表示する", async () => {
    const { rerender } = render(
      await ContentAccessGate({
        content: makeContent({ kind: "loginRequired" }),
        reason: "loginRequired",
      })
    );

    expect(screen.queryByText("プレビュー")).not.toBeInTheDocument();

    rerender(
      await ContentAccessGate({
        content: makeContent({ kind: "loginRequired" }),
        preview: { id: "fixture", introduction: "導入の概要テキスト" },
        reason: "loginRequired",
      })
    );

    expect(screen.getByText("プレビュー")).toBeInTheDocument();
    expect(screen.getByText("導入の概要テキスト")).toBeInTheDocument();
  });
});
