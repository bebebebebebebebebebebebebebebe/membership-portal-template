import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Content } from "@/features/contents/types/content";
import type { ContentViewer } from "@/features/contents/types/content-viewer";
import type { AuthUser } from "@/types/auth";

const mocks = vi.hoisted(() => ({
  ContentActionFooter: vi.fn(),
  getContentViewer: vi.fn(),
}));

vi.mock("@/features/contents/components/content-action-footer", () => ({
  ContentActionFooter: mocks.ContentActionFooter,
}));
vi.mock("@/features/contents/server/content-viewer", () => ({
  getContentViewer: mocks.getContentViewer,
}));

import { PersonalizedContentActionFooter } from "@/features/contents/components/personalized-content-action-footer";

const user: AuthUser = {
  name: "プレミアム 会員",
  email: "premium@example.com",
  avatar: "/images/avatar.png",
  initials: "PM",
  membership: "プレミアム会員",
  role: "member",
};

const viewer: ContentViewer = {
  user,
  plan: "premium",
  purchasedProductIds: [],
};

const content: Content = {
  id: "fixture",
  title: "サンプルコンテンツ",
  description: "説明",
  thumbnail: "/images/contents/sample.png",
  tags: ["タグ"],
  publicationStatus: "published",
  discoverability: "listed",
  routeAccessPolicy: { kind: "public" },
  accessPolicy: { kind: "planRequired", requiredPlans: ["premium"] },
};

describe("PersonalizedContentActionFooter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getContentViewer.mockResolvedValue(viewer);
    mocks.ContentActionFooter.mockReturnValue(
      <div data-testid="content-action-footer" />
    );
  });

  it("server-side viewer を解決して ContentActionFooter に渡す", async () => {
    render(await PersonalizedContentActionFooter({ content }));

    expect(screen.getByTestId("content-action-footer")).toBeInTheDocument();
    expect(mocks.getContentViewer).toHaveBeenCalledTimes(1);
    expect(mocks.ContentActionFooter).toHaveBeenCalledWith(
      {
        content,
        offer: undefined,
        viewer,
      },
      undefined
    );
  });
});
