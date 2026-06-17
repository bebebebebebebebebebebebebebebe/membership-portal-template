import { describe, expect, it } from "vitest";

import { mockContentRepository } from "@/features/contents/server/repositories/mock-content-repository";

describe("mockContentRepository", () => {
  it("raw content data を公開判定前の状態で返す", async () => {
    const contents = await mockContentRepository.listContents();

    expect(contents.some((content) => content.id === "draft-sample")).toBe(true);
    expect(contents.some((content) => content.id === "archived-sample")).toBe(true);
    expect(contents.some((content) => content.id === "unlisted-sample")).toBe(true);
  });

  it("metadata / detail / product offer を id で取得する", async () => {
    await expect(mockContentRepository.findContentById("1")).resolves.toMatchObject({
      id: "1",
    });
    await expect(
      mockContentRepository.findContentDetailById("member-only-blueprint")
    ).resolves.toBeDefined();
    await expect(
      mockContentRepository.findProductOfferById("product-security-checklist")
    ).resolves.toMatchObject({ productId: "product-security-checklist" });
  });

  it("存在しない raw data は undefined を返す", async () => {
    await expect(
      mockContentRepository.findContentById("missing")
    ).resolves.toBeUndefined();
    await expect(
      mockContentRepository.findContentDetailById("missing")
    ).resolves.toBeUndefined();
    await expect(
      mockContentRepository.findProductOfferById("missing")
    ).resolves.toBeUndefined();
  });
});
