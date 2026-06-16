import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Content } from "@/features/contents/types/content";
import type { ContentViewer } from "@/features/contents/types/content-viewer";

/**
 * page 本体の公開 shell 分岐を、依存 API を差し替えて検証する。
 * 認可 slot の中身は別テストに分け、ここでは metadata の早期分岐と slot への受け渡しを見る。
 */
const mocks = vi.hoisted(() => ({
  getContentMetadata: vi.fn(),
  getContentViewer: vi.fn(),
  ContentRouteGuardSlot: vi.fn(() => null),
  PersonalizedContentAccess: vi.fn(() => null),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
}));

vi.mock("@/features/contents/api/get-content-metadata", () => ({
  getContentMetadata: mocks.getContentMetadata,
}));
vi.mock("@/features/contents/api/get-content-viewer", () => ({
  getContentViewer: mocks.getContentViewer,
}));
vi.mock("next/navigation", () => ({
  notFound: mocks.notFound,
  redirect: mocks.redirect,
}));
vi.mock("@/features/contents/components/detail/content-route-guard-slot", () => ({
  ContentRouteGuardSlot: mocks.ContentRouteGuardSlot,
}));
vi.mock("@/features/contents/components/detail/personalized-content-access", () => ({
  PersonalizedContentAccess: mocks.PersonalizedContentAccess,
}));

import ContentDetailPage, * as pageModule from "../page";

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
    routeAccessPolicy: { kind: "public" },
    accessPolicy,
    author: { name: "著者", avatar: "/images/avatar.png", initials: "AB" },
    date: "2026-06-01",
    readMinutes: 5,
  };
}

function makeRouteLoginRequiredContent(
  accessPolicy: Content["accessPolicy"]
): Content {
  return {
    ...makeContent(accessPolicy),
    id: "member-only-blueprint",
    routeAccessPolicy: { kind: "loginRequired" },
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
    routeAccessPolicy: { kind: "public" },
    accessPolicy,
    fileFormat: "PDF",
    pageCount: 12,
    downloadCount: 120,
  };
}

function renderPage(id = "1") {
  return ContentDetailPage({ params: Promise.resolve({ id }) });
}

const anonymousViewer: ContentViewer = {
  user: null,
  plan: null,
  purchasedProductIds: [],
};

const memberViewer: ContentViewer = {
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

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ContentDetailPage の認可フロー", () => {
  it("route 全体を force-dynamic に固定しない", () => {
    expect("dynamic" in pageModule).toBe(false);
  });

  it("記事 metadata を route guard slot に渡す", async () => {
    const content = makeContent({ kind: "free" });
    mocks.getContentMetadata.mockResolvedValue(content);

    render(await renderPage());

    expect(mocks.ContentRouteGuardSlot).toHaveBeenCalledWith(
      { id: "1", content },
      undefined
    );
  });

  it("loginRequired content は Suspense fallback 前に anonymous user を redirect する", async () => {
    const content = makeRouteLoginRequiredContent({ kind: "free" });
    mocks.getContentMetadata.mockResolvedValue(content);
    mocks.getContentViewer.mockResolvedValue(anonymousViewer);

    await expect(renderPage("member-only-blueprint")).rejects.toThrow(
      "NEXT_REDIRECT:/login?next=%2Fcontents%2Fmember-only-blueprint"
    );
    expect(mocks.ContentRouteGuardSlot).not.toHaveBeenCalled();
    expect(mocks.PersonalizedContentAccess).not.toHaveBeenCalled();
  });

  it("loginRequired content は authenticated user だけ personalized access へ進める", async () => {
    const content = makeRouteLoginRequiredContent({ kind: "free" });
    mocks.getContentMetadata.mockResolvedValue(content);
    mocks.getContentViewer.mockResolvedValue(memberViewer);

    render(await renderPage("member-only-blueprint"));

    expect(mocks.ContentRouteGuardSlot).not.toHaveBeenCalled();
    expect(mocks.PersonalizedContentAccess).toHaveBeenCalledWith(
      {
        id: "member-only-blueprint",
        content,
        viewer: memberViewer,
      },
      undefined
    );
  });

  it("資料カテゴリは full detail を取得せず Coming Soon を表示する", async () => {
    mocks.getContentMetadata.mockResolvedValue(
      makeDocumentContent({ kind: "free" })
    );

    render(await renderPage("2"));

    expect(screen.getByText("資料ページは準備中です")).toBeInTheDocument();
    expect(screen.getByText(/サンプル資料 は現在/)).toBeInTheDocument();
    expect(mocks.ContentRouteGuardSlot).not.toHaveBeenCalled();
  });

  it("存在しないコンテンツは notFound に到達する", async () => {
    mocks.getContentMetadata.mockResolvedValue(undefined);

    await expect(renderPage("missing")).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mocks.ContentRouteGuardSlot).not.toHaveBeenCalled();
  });

  it("hidden コンテンツは notFound に到達する", async () => {
    mocks.getContentMetadata.mockResolvedValue({
      ...makeContent({ kind: "free" }),
      discoverability: "hidden",
    });

    await expect(renderPage()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mocks.ContentRouteGuardSlot).not.toHaveBeenCalled();
  });
});
