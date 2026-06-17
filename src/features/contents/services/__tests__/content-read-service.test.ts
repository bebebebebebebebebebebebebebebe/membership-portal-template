import { describe, expect, it } from "vitest";

import {
  createContentReadService,
  type AuthorizedContentDetailResult,
} from "@/features/contents/services/content-read-service";
import type { ContentRepository } from "@/features/contents/services/content-repository";
import type { ArticleContent, Content } from "@/features/contents/types/content";
import type { ContentDetail } from "@/features/contents/types/content-detail";
import type { ContentViewer } from "@/features/contents/types/content-viewer";
import type { ProductOffer } from "@/features/contents/types/product-offer";
import type { AuthUser } from "@/types/auth";

const baseUser: AuthUser = {
  name: "一般 会員",
  email: "member@example.com",
  avatar: "/images/avatars/avatar-01.jpg",
  initials: "一般",
  membership: "無料会員",
  role: "member",
};

const premiumUser: AuthUser = {
  ...baseUser,
  name: "プレミアム 会員",
  email: "premium@example.com",
  membership: "プレミアム会員",
};

const adminUser: AuthUser = {
  ...premiumUser,
  email: "admin@example.com",
  role: "admin",
};

const anonymousViewer: ContentViewer = {
  user: null,
  plan: null,
  purchasedProductIds: [],
};

const freeViewer: ContentViewer = {
  user: baseUser,
  plan: "free",
  purchasedProductIds: [],
};

const purchasedViewer: ContentViewer = {
  user: baseUser,
  plan: "free",
  purchasedProductIds: ["product-purchase"],
};

const premiumViewer: ContentViewer = {
  user: premiumUser,
  plan: "premium",
  purchasedProductIds: [],
};

const adminViewer: ContentViewer = {
  user: adminUser,
  plan: "premium",
  purchasedProductIds: [],
};

function makeContent(
  id: string,
  overrides: Partial<ArticleContent> = {}
): ArticleContent {
  return {
    id,
    category: "記事",
    title: `記事 ${id}`,
    description: `説明 ${id}`,
    thumbnail: "/images/contents/sample.png",
    tags: ["タグ"],
    publicationStatus: "published",
    discoverability: "listed",
    routeAccessPolicy: { kind: "public" },
    accessPolicy: { kind: "free" },
    author: { name: "著者", avatar: "/images/avatar.png", initials: "AB" },
    date: "2026-06-01",
    readMinutes: 5,
    ...overrides,
  };
}

function makeDetail(): ContentDetail {
  return {
    viewCount: 10,
    publishedDate: "2026-06-01",
    updatedDate: "2026-06-02",
    summary: { title: "要点", body: "本文要約" },
    sections: [],
    steps: [],
    conclusion: "まとめ",
    cycleLabel: "サイクル",
    toc: [],
    comments: [],
  };
}

const contents = [
  makeContent("free"),
  makeContent("purchase", {
    accessPolicy: { kind: "purchaseRequired", productId: "product-purchase" },
  }),
  makeContent("plan", {
    accessPolicy: { kind: "planRequired", requiredPlans: ["premium"] },
  }),
  makeContent("route-login", {
    routeAccessPolicy: { kind: "loginRequired" },
    accessPolicy: { kind: "planRequired", requiredPlans: ["premium"] },
  }),
  makeContent("hidden", { discoverability: "hidden" }),
  makeContent("draft", { publicationStatus: "draft" }),
  makeContent("archived", { publicationStatus: "archived" }),
  makeContent("unlisted", { discoverability: "unlisted" }),
] satisfies Content[];

const details: Record<string, ContentDetail> = {
  free: makeDetail(),
  purchase: makeDetail(),
  plan: makeDetail(),
  "route-login": makeDetail(),
  hidden: makeDetail(),
  unlisted: makeDetail(),
};

const offers: Record<string, ProductOffer> = {
  "product-purchase": {
    productId: "product-purchase",
    price: 1980,
    currency: "JPY",
    taxIncluded: true,
    available: true,
  },
};

function makeRepository(): ContentRepository {
  return {
    async listContents() {
      return contents;
    },

    async findContentById(id) {
      return contents.find((content) => content.id === id);
    },

    async findContentDetailById(id) {
      return details[id];
    },

    async findProductOfferById(productId) {
      return offers[productId];
    },
  };
}

function expectStatus(
  result: AuthorizedContentDetailResult,
  status: AuthorizedContentDetailResult["status"]
) {
  expect(result.status).toBe(status);
}

describe("createContentReadService", () => {
  const service = createContentReadService(makeRepository());

  it("listed-published の catalog だけを返し、購入系 content だけ offer を解決する", async () => {
    const items = await service.getContentCatalogItems();
    const byId = new Map(items.map((item) => [item.content.id, item]));

    expect([...byId.keys()]).toEqual(["free", "purchase", "plan", "route-login"]);
    expect(byId.get("purchase")?.offer).toEqual(offers["product-purchase"]);
    expect(byId.get("free")?.offer).toBeUndefined();
    expect(byId.get("plan")?.offer).toBeUndefined();
  });

  it("generateStaticParams 用には listed-published の id だけを返す", async () => {
    await expect(service.getPrerenderableContentIds()).resolves.toEqual([
      "free",
      "purchase",
      "plan",
      "route-login",
    ]);
  });

  it("metadata は公開到達可能な content だけを返す", async () => {
    await expect(service.getPublicContentMetadata("unlisted")).resolves.toMatchObject({
      id: "unlisted",
    });
    await expect(service.getPublicContentMetadata("hidden")).resolves.toBeUndefined();
    await expect(service.getPublicContentMetadata("draft")).resolves.toBeUndefined();
    await expect(service.getPublicContentMetadata("archived")).resolves.toBeUndefined();
  });

  it("preview は metadata 由来の安全な情報だけを返す", async () => {
    await expect(service.getPublicContentPreview("free")).resolves.toEqual({
      id: "free",
      introduction: "説明 free",
    });
  });

  it("related は listed-published のみから現在 id を除外して返す", async () => {
    await expect(service.getPublicRelatedContents("free", 2)).resolves.toEqual([
      contents[1],
      contents[2],
    ]);
  });

  it("product offer を repository から解決する", async () => {
    await expect(service.getProductOffer("product-purchase")).resolves.toEqual(
      offers["product-purchase"]
    );
  });

  it("anonymous は loginRequired route の full detail を取得できない", async () => {
    const result = await service.getAuthorizedContentDetail(
      "route-login",
      anonymousViewer
    );

    expectStatus(result, "forbidden");
  });

  it("plan 不一致の viewer には full detail を返さない", async () => {
    const result = await service.getAuthorizedContentDetail("plan", freeViewer);

    expectStatus(result, "forbidden");
  });

  it("購入済み viewer には purchaseRequired detail を返す", async () => {
    const result = await service.getAuthorizedContentDetail(
      "purchase",
      purchasedViewer
    );

    expectStatus(result, "ok");
  });

  it("premium viewer は loginRequired route 通過後に planRequired detail を取得できる", async () => {
    const result = await service.getAuthorizedContentDetail(
      "route-login",
      premiumViewer
    );

    expectStatus(result, "ok");
  });

  it("admin viewer は planRequired detail を取得できる", async () => {
    const result = await service.getAuthorizedContentDetail("plan", adminViewer);

    expectStatus(result, "ok");
  });

  it("公開到達不可または detail 不在の content は notFound を返す", async () => {
    expectStatus(
      await service.getAuthorizedContentDetail("hidden", premiumViewer),
      "notFound"
    );
    expectStatus(
      await service.getAuthorizedContentDetail("missing", premiumViewer),
      "notFound"
    );
    expectStatus(
      await service.getAuthorizedContentDetail("draft", premiumViewer),
      "notFound"
    );
  });
});
