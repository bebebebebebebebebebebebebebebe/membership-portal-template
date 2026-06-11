import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Content } from "@/features/contents/types/content";
import type { ContentViewer } from "@/features/contents/types/content-viewer";

/**
 * route の認可フローを、依存 API を差し替えて検証する。
 * canViewContent / isPubliclyAccessibleContentMetadata は実装を使い、データ取得と
 * notFound・描画コンポーネントだけをモックする。NEXT_NOT_FOUND を投げて notFound() 到達を表す。
 */
const mocks = vi.hoisted(() => ({
  getContentMetadata: vi.fn(),
  getContentViewer: vi.fn(),
  getContentDetail: vi.fn(),
  getContentPreview: vi.fn(),
  getRelatedContents: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/features/contents/api/get-content-metadata", () => ({
  getContentMetadata: mocks.getContentMetadata,
}));
vi.mock("@/features/contents/api/get-content-viewer", () => ({
  getContentViewer: mocks.getContentViewer,
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
vi.mock("next/navigation", () => ({ notFound: mocks.notFound }));
vi.mock("@/features/contents/components/content-access-gate", () => ({
  ContentAccessGate: () => null,
}));
vi.mock("@/features/contents/components/detail/article-detail", () => ({
  ArticleDetail: () => null,
}));

import ContentDetailPage from "../page";

function makeContent(accessPolicy: Content["accessPolicy"]): Content {
  return {
    id: "1",
    category: "記事",
    title: "サンプル記事",
    description: "説明",
    thumbnail: "/images/contents/sample.png",
    tags: ["タグ"],
    publicationStatus: "published",
    discoverability: "listed",
    accessPolicy,
    author: { name: "著者", avatar: "/images/avatar.png", initials: "AB" },
    date: "2026-06-01",
    readMinutes: 5,
  };
}

function makeDocumentContent(accessPolicy: Content["accessPolicy"]): Content {
  return {
    id: "2",
    category: "資料",
    title: "サンプル資料",
    description: "説明",
    thumbnail: "/images/contents/sample.png",
    tags: ["タグ"],
    publicationStatus: "published",
    discoverability: "listed",
    accessPolicy,
    fileFormat: "PDF",
    pageCount: 12,
    downloadCount: 120,
  };
}

const anonymousViewer: ContentViewer = {
  user: null,
  plan: null,
  purchasedProductIds: [],
};

function renderPage(id = "1") {
  return ContentDetailPage({ params: Promise.resolve({ id }) });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getContentViewer.mockResolvedValue(anonymousViewer);
  mocks.getRelatedContents.mockReturnValue([]);
  mocks.getContentPreview.mockReturnValue({ id: "1", introduction: "概要" });
  mocks.getContentDetail.mockReturnValue({ sections: [], comments: [] });
});

describe("ContentDetailPage の認可フロー", () => {
  it("denied 時に getContentDetail を呼ばず gate を返す", async () => {
    mocks.getContentMetadata.mockReturnValue(
      makeContent({ kind: "loginRequired" })
    );

    await renderPage();

    expect(mocks.getContentDetail).not.toHaveBeenCalled();
    expect(mocks.getContentPreview).toHaveBeenCalledWith("1");
  });

  it("allowed 時に getContentDetail を呼ぶ", async () => {
    mocks.getContentMetadata.mockReturnValue(makeContent({ kind: "free" }));

    await renderPage();

    expect(mocks.getContentDetail).toHaveBeenCalledWith("1");
  });

  it("資料カテゴリは full detail を取得せず Coming Soon を表示する", async () => {
    mocks.getContentMetadata.mockReturnValue(
      makeDocumentContent({ kind: "free" })
    );

    render(await renderPage("2"));

    expect(screen.getByText("資料ページは準備中です")).toBeInTheDocument();
    expect(screen.getByText(/サンプル資料 は現在/)).toBeInTheDocument();
    expect(mocks.getContentViewer).not.toHaveBeenCalled();
    expect(mocks.getContentDetail).not.toHaveBeenCalled();
  });

  it("存在しないコンテンツは notFound に到達する", async () => {
    mocks.getContentMetadata.mockReturnValue(undefined);

    await expect(renderPage("missing")).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mocks.getContentDetail).not.toHaveBeenCalled();
  });

  it("hidden コンテンツは notFound に到達する", async () => {
    mocks.getContentMetadata.mockReturnValue({
      ...makeContent({ kind: "free" }),
      discoverability: "hidden",
    });

    await expect(renderPage()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mocks.getContentDetail).not.toHaveBeenCalled();
  });
});
