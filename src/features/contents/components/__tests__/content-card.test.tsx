import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  PersonalizedContentActionFooter: vi.fn(),
}));

vi.mock("@/features/contents/components/personalized-content-action-footer", () => ({
  PersonalizedContentActionFooter: mocks.PersonalizedContentActionFooter,
}));

import { ContentCard } from "@/features/contents/components/content-card";
import type { Content } from "@/features/contents/types/content";
import type { ContentAccessPolicy } from "@/features/contents/types/content-access";

function makeContent(accessPolicy: ContentAccessPolicy): Content {
  return {
    id: "fixture",
    title: "サンプルコンテンツ",
    description: "説明",
    thumbnail: "/images/contents/sample.png",
    tags: ["セキュリティ"],
    publicationStatus: "published",
    discoverability: "listed",
    routeAccessPolicy: { kind: "public" },
    accessPolicy,
  };
}

describe("ContentCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.PersonalizedContentActionFooter.mockImplementation(
      ({ content }: { content: Content }) => (
        <div data-testid="personalized-footer">slot:{content.id}</div>
      )
    );
  });

  it("タグは CardContent に表示し、本文側に閲覧条件を残さない", async () => {
    render(
      await ContentCard({
        content: makeContent({ kind: "planRequired", requiredPlans: ["premium"] }),
      })
    );

    const tag = screen.getByText("セキュリティ");
    const cardContent = tag.closest('[data-slot="card-content"]');

    expect(cardContent).not.toBeNull();
    expect(cardContent).toHaveTextContent("セキュリティ");
    expect(cardContent).not.toHaveTextContent("閲覧条件");
    expect(cardContent).not.toHaveTextContent("有料プラン");
  });

  it("閲覧条件と CTA は personalized footer slot に委譲する", async () => {
    const content = makeContent({
      kind: "planRequired",
      requiredPlans: ["premium"],
    });

    render(
      await ContentCard({
        content,
      })
    );

    const footer = screen
      .getByTestId("personalized-footer")
      .closest('[data-slot="card-footer"]');

    expect(footer).not.toBeNull();
    expect(footer).toHaveTextContent("slot:fixture");
    expect(mocks.PersonalizedContentActionFooter).toHaveBeenCalledWith(
      {
        content,
        offer: undefined,
      },
      undefined
    );
  });

  it("カード本体は personalized footer の文言に依存しない", async () => {
    render(await ContentCard({ content: makeContent({ kind: "free" }) }));

    expect(screen.queryByText("閲覧条件")).not.toBeInTheDocument();
    expect(screen.getByTestId("personalized-footer")).toBeInTheDocument();
  });
});
