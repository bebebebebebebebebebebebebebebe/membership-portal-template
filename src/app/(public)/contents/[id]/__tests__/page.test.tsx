import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Content } from "@/features/contents/types/content";

/**
 * page 本体の公開 shell 分岐を、server data access を差し替えて検証する。
 * viewer 取得・route guard・accessPolicy 判定・full detail 取得は Suspense 内の
 * `ContentRouteGuardSlot` 以下へ隔離したため、ここでは metadata の早期分岐と slot への
 * 受け渡しだけを見る。redirect 判定は guard slot 側のテストで担保する。
 */
const mocks = vi.hoisted(() => ({
  getPublicContentMetadata: vi.fn(),
  getPrerenderableContentIds: vi.fn(),
  ContentRouteGuardSlot: vi.fn(() => null),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/features/contents/server/content-read-service", () => ({
  getPublicContentMetadata: mocks.getPublicContentMetadata,
  getPrerenderableContentIds: mocks.getPrerenderableContentIds,
}));
vi.mock("next/navigation", () => ({
  notFound: mocks.notFound,
}));
vi.mock("@/features/contents/components/detail/content-route-guard-slot", () => ({
  ContentRouteGuardSlot: mocks.ContentRouteGuardSlot,
}));

import ContentDetailPage, { generateStaticParams } from "../page";
import * as pageModule from "../page";

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

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ContentDetailPage の static shell 分岐", () => {
  it("route 全体を force-dynamic に固定しない", () => {
    expect("dynamic" in pageModule).toBe(false);
  });

  it("generateStaticParams は prerender 対象 id を params 形に変換する", async () => {
    mocks.getPrerenderableContentIds.mockResolvedValue(["1", "member-only"]);

    await expect(generateStaticParams()).resolves.toEqual([
      { id: "1" },
      { id: "member-only" },
    ]);
  });

  it("記事 metadata を route guard slot に渡す", async () => {
    const content = makeContent({ kind: "free" });
    mocks.getPublicContentMetadata.mockResolvedValue(content);

    render(await renderPage());

    expect(mocks.ContentRouteGuardSlot).toHaveBeenCalledWith(
      { id: "1", content },
      undefined
    );
  });

  it("資料カテゴリは full detail を取得せず Coming Soon を表示する", async () => {
    mocks.getPublicContentMetadata.mockResolvedValue(
      makeDocumentContent({ kind: "free" })
    );

    render(await renderPage("2"));

    expect(screen.getByText("資料ページは準備中です")).toBeInTheDocument();
    expect(screen.getByText(/サンプル資料 は現在/)).toBeInTheDocument();
    expect(mocks.ContentRouteGuardSlot).not.toHaveBeenCalled();
  });

  it("到達不可（hidden・未公開・不在）の metadata は notFound に到達する", async () => {
    mocks.getPublicContentMetadata.mockResolvedValue(undefined);

    await expect(renderPage("missing")).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mocks.ContentRouteGuardSlot).not.toHaveBeenCalled();
  });
});
