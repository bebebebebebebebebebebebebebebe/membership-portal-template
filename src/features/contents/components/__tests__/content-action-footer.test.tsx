import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ContentActionFooter,
  ContentActionFooterFallback,
} from "@/features/contents/components/content-action-footer";
import type { Content } from "@/features/contents/types/content";
import type { ContentAccessPolicy } from "@/features/contents/types/content-access";
import type { ContentViewer } from "@/features/contents/types/content-viewer";
import type { ProductOffer } from "@/features/contents/types/product-offer";
import type { AuthUser } from "@/types/auth";

/**
 * accessPolicy だけを差し替えて footer を描画するための汎用コンテンツ fixture。
 * 価格は呼び出し側で解決した offer を props で渡すため、footer 自身はデータ取得しない。
 */
function makeContent(accessPolicy: ContentAccessPolicy): Content {
  return {
    id: "fixture",
    title: "サンプルコンテンツ",
    description: "説明",
    thumbnail: "/images/contents/sample.png",
    tags: ["タグ"],
    publicationStatus: "published",
    discoverability: "listed",
    routeAccessPolicy: { kind: "public" },
    accessPolicy,
  };
}

function makeOffer(productId: string, price: number): ProductOffer {
  return {
    productId,
    price,
    currency: "JPY",
    taxIncluded: true,
    available: true,
  };
}

function makeUser(membership: string, role: AuthUser["role"] = "member"): AuthUser {
  return {
    name: "テストユーザー",
    email: "user@example.com",
    avatar: "/images/avatar.png",
    initials: "TU",
    membership,
    role,
  };
}

const premiumViewer: ContentViewer = {
  user: makeUser("プレミアム会員"),
  plan: "premium",
  purchasedProductIds: [],
};

const freeViewer: ContentViewer = {
  user: makeUser("無料会員"),
  plan: "free",
  purchasedProductIds: [],
};

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

  it("purchaseRequired は渡された ProductOffer 由来の価格を表示する", () => {
    render(
      <ContentActionFooter
        content={makeContent({
          kind: "purchaseRequired",
          productId: "product-security-checklist",
        })}
        offer={makeOffer("product-security-checklist", 1980)}
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
        offer={makeOffer("product-modern-javascript", 2480)}
      />
    );

    expect(screen.getByText("有料プランまたは2,480円")).toBeInTheDocument();
  });

  it("権限を満たす viewer には閲覧条件を出さず詳細導線を表示する", () => {
    render(
      <ContentActionFooter
        content={makeContent({
          kind: "planRequired",
          requiredPlans: ["premium"],
        })}
        viewer={premiumViewer}
      />
    );

    expect(screen.queryByText("閲覧条件")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /詳細を見る/ })).toBeInTheDocument();
    expect(screen.queryByText("プランを確認")).not.toBeInTheDocument();
  });

  it("権限不足 viewer には policy 別の閲覧条件と CTA を表示する", () => {
    render(
      <ContentActionFooter
        content={makeContent({
          kind: "planRequired",
          requiredPlans: ["premium"],
        })}
        viewer={freeViewer}
      />
    );

    expect(screen.getByText("閲覧条件")).toBeInTheDocument();
    expect(screen.getByText("有料プラン加入で閲覧")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /プランを確認/ })).toBeInTheDocument();
  });

  it("fallback は具体的な CTA 文言を表示しない", () => {
    render(<ContentActionFooterFallback />);

    expect(
      screen.getByLabelText("閲覧条件とアクションを読み込み中")
    ).toBeInTheDocument();
    expect(screen.queryByText("ログインして閲覧")).not.toBeInTheDocument();
    expect(screen.queryByText("購入して見る")).not.toBeInTheDocument();
    expect(screen.queryByText("プランを確認")).not.toBeInTheDocument();
    expect(screen.queryByText("詳細を見る")).not.toBeInTheDocument();
  });
});
