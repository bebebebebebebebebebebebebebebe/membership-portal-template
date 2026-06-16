import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ArticleContent } from "@/features/contents/types/content";
import type { ContentViewer } from "@/features/contents/types/content-viewer";

const mocks = vi.hoisted(() => ({
  getContentDetail: vi.fn(),
  getContentPreview: vi.fn(),
  getRelatedContents: vi.fn(),
  ArticleDetail: vi.fn(() => null),
  ContentAccessGate: vi.fn(() => null),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/features/contents/api/get-content-detail", () => ({
  getContentDetail: mocks.getContentDetail,
}));
vi.mock("@/features/contents/api/get-content-preview", () => ({
  getContentPreview: mocks.getContentPreview,
}));
vi.mock("@/features/contents/api/get-contents", () => ({
  getRelatedContents: mocks.getRelatedContents,
}));
vi.mock("@/features/contents/components/content-access-gate", () => ({
  ContentAccessGate: mocks.ContentAccessGate,
}));
vi.mock("@/features/contents/components/detail/article-detail", () => ({
  ArticleDetail: mocks.ArticleDetail,
}));
vi.mock("next/navigation", () => ({ notFound: mocks.notFound }));

import { PersonalizedContentAccess } from "../personalized-content-access";

const anonymousViewer: ContentViewer = {
  user: null,
  plan: null,
  purchasedProductIds: [],
};

const premiumViewer: ContentViewer = {
  user: {
    name: "山田 太郎",
    email: "taro.yamada@example.com",
    avatar: "/images/avatars/avatar-06.jpg",
    initials: "山田",
    membership: "プレミアム会員",
    role: "member",
  },
  plan: "premium",
  purchasedProductIds: [],
};

function makeContent(accessPolicy: ArticleContent["accessPolicy"]): ArticleContent {
  return {
    id: "member-only-blueprint",
    category: "記事",
    title: "会員限定ブループリント",
    description: "説明",
    thumbnail: "/images/contents/sample.png",
    tags: ["会員限定"],
    publicationStatus: "published",
    discoverability: "unlisted",
    routeAccessPolicy: { kind: "loginRequired" },
    accessPolicy,
    author: { name: "著者", avatar: "/images/avatar.png", initials: "AB" },
    date: "2026-06-01",
    readMinutes: 5,
  };
}

describe("PersonalizedContentAccess", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getContentPreview.mockResolvedValue({
      id: "member-only-blueprint",
      introduction: "概要",
    });
    mocks.getRelatedContents.mockResolvedValue([]);
    mocks.getContentDetail.mockResolvedValue({
      sections: [],
      comments: [],
      summary: { title: "要点", body: "本文" },
      steps: [],
      conclusion: "まとめ",
      cycleLabel: "サイクル",
      toc: [],
      viewCount: 1,
      publishedDate: "2026/06/01",
      updatedDate: "2026/06/01",
    });
  });

  it("accessPolicy denied 時に full detail を取得せず Content Gate を返す", async () => {
    const content = makeContent({
      kind: "planRequired",
      requiredPlans: ["premium"],
    });

    render(
      await PersonalizedContentAccess({
        id: "member-only-blueprint",
        content,
        viewer: anonymousViewer,
      })
    );

    expect(mocks.getContentDetail).not.toHaveBeenCalled();
    expect(mocks.getContentPreview).toHaveBeenCalledWith(
      "member-only-blueprint"
    );
    expect(mocks.ContentAccessGate).toHaveBeenCalledWith(
      {
        content,
        preview: {
          id: "member-only-blueprint",
          introduction: "概要",
        },
        reason: "planRequired",
      }
    );
  });

  it("accessPolicy allowed 時に full detail を取得して ArticleDetail を返す", async () => {
    const content = makeContent({
      kind: "planRequired",
      requiredPlans: ["premium"],
    });

    render(
      await PersonalizedContentAccess({
        id: "member-only-blueprint",
        content,
        viewer: premiumViewer,
      })
    );

    expect(mocks.getContentDetail).toHaveBeenCalledWith(
      "member-only-blueprint"
    );
    expect(mocks.ArticleDetail).toHaveBeenCalledWith(
      expect.objectContaining({
        content,
        related: [],
        currentUser: premiumViewer.user,
      }),
      undefined
    );
  });

  it("allowed 後に detail が存在しない場合は notFound に到達する", async () => {
    const content = makeContent({ kind: "free" });
    mocks.getContentDetail.mockResolvedValue(undefined);

    await expect(
      PersonalizedContentAccess({
        id: "missing-detail",
        content,
        viewer: premiumViewer,
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
