import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContentActionFooter } from "@/features/contents/components/content-action-footer";
import type { Content } from "@/features/contents/types/content";
import type { ContentAccessPolicy } from "@/features/contents/types/content-access";

/**
 * accessPolicy だけを差し替えて footer を描画するための記事コンテンツ fixture。
 * 価格表示は ContentActionFooter 内部の getProductOffer() に依存するため、
 * 実在する mock productId（1,980円 / 2,480円）を指す policy を渡す。
 */
function makeContent(accessPolicy: ContentAccessPolicy): Content {
  return {
    id: "fixture",
    title: "サンプル記事",
    description: "説明",
    thumbnail: "/images/contents/sample.png",
    tags: ["タグ"],
    publicationStatus: "published",
    discoverability: "listed",
    accessPolicy,
    category: "記事",
    author: { name: "著者", avatar: "/images/avatar.png", initials: "AB" },
    date: "2026-06-01",
    readMinutes: 5,
  };
}

describe("ContentActionFooter", () => {
  it("free は閲覧条件を出さず詳細導線の CTA だけ表示する", () => {
    render(<ContentActionFooter content={makeContent({ kind: "free" })} />);

    expect(screen.queryByText("閲覧条件")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /詳細を見る/ })).toBeInTheDocument();
  });

  it("loginRequired は閲覧条件と無料・ログインの文言を表示する", () => {
    render(
      <ContentActionFooter content={makeContent({ kind: "loginRequired" })} />
    );

    expect(screen.getByText("閲覧条件")).toBeInTheDocument();
    expect(screen.getByText("無料・ログインで閲覧")).toBeInTheDocument();
  });

  it("planRequired は有料プランの閲覧条件を表示する", () => {
    render(
      <ContentActionFooter
        content={makeContent({ kind: "planRequired", requiredPlans: ["premium"] })}
      />
    );

    expect(screen.getByText("閲覧条件")).toBeInTheDocument();
    expect(screen.getByText("有料プラン加入で閲覧")).toBeInTheDocument();
  });

  it("purchaseRequired は ProductOffer 由来の価格を表示する", () => {
    render(
      <ContentActionFooter
        content={makeContent({
          kind: "purchaseRequired",
          productId: "product-security-checklist",
        })}
      />
    );

    expect(screen.getByText("1,980円")).toBeInTheDocument();
  });

  it("planOrPurchase は価格込みの閲覧条件を表示する", () => {
    render(
      <ContentActionFooter
        content={makeContent({
          kind: "planOrPurchase",
          requiredPlans: ["standard", "premium"],
          productId: "product-modern-javascript",
        })}
      />
    );

    expect(screen.getByText("有料プランまたは2,480円")).toBeInTheDocument();
  });
});
