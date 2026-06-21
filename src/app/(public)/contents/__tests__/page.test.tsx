import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getContentViewer: vi.fn(),
  PersonalizedContentActionFooter: vi.fn(() => (
    <div data-testid="personalized-content-action-footer" />
  )),
}));

vi.mock("@/features/contents/server/content-viewer", () => ({
  getContentViewer: mocks.getContentViewer,
}));
vi.mock("@/features/contents/components/personalized-content-action-footer", () => ({
  PersonalizedContentActionFooter: mocks.PersonalizedContentActionFooter,
}));

import ContentsPage from "@/app/(public)/contents/page";

describe("ContentsPage", () => {
  it("統計カードを表示せず、一覧フィルターとコンテンツ一覧を表示する", async () => {
    const page = await ContentsPage();

    expect(mocks.getContentViewer).not.toHaveBeenCalled();

    render(page);

    expect(screen.queryByText("総コンテンツ")).not.toBeInTheDocument();
    expect(screen.queryByText("お気に入り")).not.toBeInTheDocument();
    expect(screen.queryByText("今週の新着")).not.toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "コンテンツカタログ" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: "キーワードで検索" })
    ).toBeInTheDocument();
    expect(screen.getByText("検索結果 24件")).toBeInTheDocument();
  });
});
