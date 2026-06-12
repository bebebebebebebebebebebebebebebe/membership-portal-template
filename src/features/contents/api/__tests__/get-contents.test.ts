import { describe, expect, it } from "vitest";

import { getContents, getRelatedContents } from "@/features/contents/api/get-contents";

describe("getContents", () => {
  it("HTTP API 経由で published + listed のコンテンツだけを返す", async () => {
    const contents = await getContents();
    const ids = contents.map((content) => content.id);

    expect(ids).toEqual(["1", "2", "4", "5", "7", "8"]);
    expect(ids).not.toContain("draft-sample");
    expect(ids).not.toContain("scheduled-sample");
    expect(ids).not.toContain("unlisted-sample");
    expect(ids).not.toContain("archived-sample");
  });
});

describe("getRelatedContents", () => {
  it("HTTP API 経由で現在の id と非掲載コンテンツを除外する", async () => {
    const related = await getRelatedContents("1", 3);
    const ids = related.map((content) => content.id);

    expect(ids).toEqual(["2", "4", "5"]);
    expect(ids).not.toContain("1");
    expect(ids).not.toContain("unlisted-sample");
  });
});
