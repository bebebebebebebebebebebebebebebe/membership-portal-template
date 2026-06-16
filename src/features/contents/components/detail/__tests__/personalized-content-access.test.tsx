import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ArticleContent } from "@/features/contents/types/content";
import type { ContentDetail } from "@/features/contents/types/content-detail";
import type { ContentViewer } from "@/features/contents/types/content-viewer";

const mocks = vi.hoisted(() => ({
  getAuthorizedContentDetail: vi.fn(),
  getPublicContentPreview: vi.fn(),
  getPublicRelatedContents: vi.fn(),
  ArticleDetail: vi.fn(() => null),
  ContentAccessGate: vi.fn(() => null),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/features/contents/server/content-read-service", () => ({
  getAuthorizedContentDetail: mocks.getAuthorizedContentDetail,
  getPublicContentPreview: mocks.getPublicContentPreview,
  getPublicRelatedContents: mocks.getPublicRelatedContents,
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

const detailFixture: ContentDetail = {
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
    mocks.getPublicContentPreview.mockResolvedValue({
      id: "member-only-blueprint",
      introduction: "概要",
    });
    mocks.getPublicRelatedContents.mockResolvedValue([]);
    mocks.getAuthorizedContentDetail.mockResolvedValue({
      status: "ok",
      detail: detailFixture,
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

    expect(mocks.getAuthorizedContentDetail).not.toHaveBeenCalled();
    expect(mocks.getPublicContentPreview).toHaveBeenCalledWith(
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
      },
      undefined
    );
  });

  it("accessPolicy allowed 時に認可済み full detail を取得して ArticleDetail を返す", async () => {
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

    expect(mocks.getAuthorizedContentDetail).toHaveBeenCalledWith(
      "member-only-blueprint",
      premiumViewer
    );
    expect(mocks.ArticleDetail).toHaveBeenCalledWith(
      expect.objectContaining({
        content,
        detail: detailFixture,
        related: [],
        currentUser: premiumViewer.user,
      }),
      undefined
    );
  });

  it("認可結果が forbidden の場合は full detail を返さず Content Gate を表示する", async () => {
    const content = makeContent({ kind: "free" });
    mocks.getAuthorizedContentDetail.mockResolvedValue({ status: "forbidden" });

    render(
      await PersonalizedContentAccess({
        id: "member-only-blueprint",
        content,
        viewer: premiumViewer,
      })
    );

    expect(mocks.ArticleDetail).not.toHaveBeenCalled();
    expect(mocks.ContentAccessGate).toHaveBeenCalledWith(
      {
        content,
        preview: {
          id: "member-only-blueprint",
          introduction: "概要",
        },
        reason: "loginRequired",
      },
      undefined
    );
  });

  it("認可結果が notFound の場合は notFound に到達する", async () => {
    const content = makeContent({ kind: "free" });
    mocks.getAuthorizedContentDetail.mockResolvedValue({ status: "notFound" });

    await expect(
      PersonalizedContentAccess({
        id: "missing-detail",
        content,
        viewer: premiumViewer,
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
