import { describe, expect, it } from "vitest";

import { getContentDetail } from "@/features/contents/api/get-content-detail";

describe("getContentDetail", () => {
  it("記事 id に対して full detail（本文セクション・コメント）を返す", () => {
    const detail = getContentDetail("1");

    expect(detail).toBeDefined();
    expect(detail?.sections.length).toBeGreaterThan(0);
    expect(detail?.comments).toBeDefined();
    expect(detail?.summary.body).toBeTruthy();
  });

  it("詳細データを持たない id には undefined を返す", () => {
    expect(getContentDetail("does-not-exist")).toBeUndefined();
  });
});
