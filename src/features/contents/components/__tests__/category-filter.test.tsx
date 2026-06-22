import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CategoryFilter } from "@/features/contents/components/category-filter";

describe("CategoryFilter", () => {
  it("キーワード検索を主操作領域に表示し、content type 固有のタブは持たない", () => {
    render(<CategoryFilter />);

    const searchInput = screen.getByRole("searchbox", {
      name: "キーワードで検索",
    });
    const primaryRegion = searchInput.closest('[data-filter-region="primary"]');

    expect(primaryRegion).not.toBeNull();
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
  });

  it("詳細フィルターとブックマーク切替を右側フィルター領域に表示する", () => {
    render(<CategoryFilter />);

    const bookmarkToggle = screen.getByRole("button", {
      name: "ブックマーク済みのみ表示",
    });
    const refinementRegion = bookmarkToggle.closest(
      '[data-filter-region="refinements"]'
    );

    expect(refinementRegion).not.toBeNull();
    expect(refinementRegion).toHaveTextContent("タグ");
    expect(refinementRegion).toHaveTextContent("更新日");
    expect(refinementRegion).toHaveTextContent("人気順");
    expect(refinementRegion).toHaveTextContent("ブックマーク済みのみ");
    expect(refinementRegion).toHaveTextContent("検索結果 24件");
  });
});
