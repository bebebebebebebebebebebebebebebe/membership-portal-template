import { describe, expect, it } from "vitest";

import {
  getAuthorizedContentDetail,
  getContentCatalogItems,
  getPrerenderableContentIds,
  getPublicContentMetadata,
} from "@/features/contents/server/content-read-queries";
import type { ContentViewer } from "@/features/contents/types/content-viewer";

const anonymousViewer: ContentViewer = {
  user: null,
  plan: null,
  purchasedProductIds: [],
};

describe("getPrerenderableContentIds", () => {
  it("listed-published の id だけを返し、hidden/draft/scheduled/archived/unlisted は含めない", async () => {
    const ids = await getPrerenderableContentIds();

    expect(ids).toEqual(["1", "2", "4", "5", "7", "8"]);
    expect(ids).not.toContain("member-only-blueprint");
    expect(ids).not.toContain("unlisted-sample");
    expect(ids).not.toContain("draft-sample");
    expect(ids).not.toContain("scheduled-sample");
    expect(ids).not.toContain("archived-sample");
  });
});

describe("getContentCatalogItems", () => {
  it("単品購入を含む content だけ offer を解決し、それ以外は offer を持たない", async () => {
    const items = await getContentCatalogItems();
    const byId = new Map(items.map((item) => [item.content.id, item]));

    // purchaseRequired / planOrPurchase は offer を解決済みで持つ。
    expect(byId.get("5")?.offer?.productId).toBe("product-security-checklist");
    expect(byId.get("7")?.offer?.productId).toBe("product-modern-javascript");

    // free / loginRequired / planRequired は価格表示不要なので offer を持たない。
    expect(byId.get("1")?.offer).toBeUndefined();
    expect(byId.get("2")?.offer).toBeUndefined();
    expect(byId.get("4")?.offer).toBeUndefined();
  });
});

describe("getPublicContentMetadata", () => {
  it("published かつ到達可能な metadata を返す（unlisted-published も含む）", async () => {
    await expect(getPublicContentMetadata("1")).resolves.toMatchObject({
      id: "1",
    });
    await expect(
      getPublicContentMetadata("member-only-blueprint")
    ).resolves.toMatchObject({ id: "member-only-blueprint" });
  });

  it("hidden / 未公開 / 不在は undefined を返す", async () => {
    await expect(getPublicContentMetadata("draft-sample")).resolves.toBeUndefined();
    await expect(
      getPublicContentMetadata("archived-sample")
    ).resolves.toBeUndefined();
    await expect(getPublicContentMetadata("does-not-exist")).resolves.toBeUndefined();
  });
});

describe("getAuthorizedContentDetail", () => {
  it("loginRequired route の anonymous viewer には full detail を返さず forbidden を返す", async () => {
    await expect(
      getAuthorizedContentDetail("member-only-blueprint", anonymousViewer)
    ).resolves.toEqual({ status: "forbidden" });
  });
});
