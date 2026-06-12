import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ContentsPage from "@/app/(public)/contents/page";

describe("ContentsPage", () => {
  it("統計カードを表示せず、一覧フィルターとコンテンツ一覧を表示する", async () => {
    render(await ContentsPage());

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
