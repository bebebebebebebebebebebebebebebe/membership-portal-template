import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContentCard } from "@/features/contents/components/content-card";
import type { Content } from "@/features/contents/types/content";
import type { ContentAccessPolicy } from "@/features/contents/types/content-access";

function makeContent(accessPolicy: ContentAccessPolicy): Content {
  return {
    id: "fixture",
    title: "サンプル記事",
    description: "説明",
    thumbnail: "/images/contents/sample.png",
    tags: ["セキュリティ"],
    publicationStatus: "published",
    discoverability: "listed",
    accessPolicy,
    category: "記事",
    author: { name: "著者", avatar: "/images/avatar.png", initials: "AB" },
    date: "2026-06-01",
    readMinutes: 5,
  };
}

describe("ContentCard", () => {
  it("タグは CardContent に表示し、本文側に閲覧条件を残さない", () => {
    render(
      <ContentCard
        content={makeContent({ kind: "planRequired", requiredPlans: ["premium"] })}
      />
    );

    const tag = screen.getByText("セキュリティ");
    const cardContent = tag.closest('[data-slot="card-content"]');

    expect(cardContent).not.toBeNull();
    expect(cardContent).toHaveTextContent("セキュリティ");
    expect(cardContent).not.toHaveTextContent("閲覧条件");
    expect(cardContent).not.toHaveTextContent("有料プラン");
  });

  it("閲覧条件と CTA は CardFooter に表示する", () => {
    render(
      <ContentCard
        content={makeContent({ kind: "planRequired", requiredPlans: ["premium"] })}
      />
    );

    const footer = screen
      .getByText("閲覧条件")
      .closest('[data-slot="card-footer"]');

    expect(footer).not.toBeNull();
    expect(footer).toHaveTextContent("有料プラン加入で閲覧");
    expect(footer).toHaveTextContent("プランを確認");
  });

  it("free は閲覧条件を出さず CTA だけ表示する", () => {
    render(<ContentCard content={makeContent({ kind: "free" })} />);

    expect(screen.queryByText("閲覧条件")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /詳細を見る/ })).toBeInTheDocument();
  });
});
