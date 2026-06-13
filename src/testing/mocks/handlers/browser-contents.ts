import { http, HttpResponse } from "msw";

import { mockContentDetails } from "@/features/contents/data/mock-content-details";
import { mockContents } from "@/features/contents/data/mock-contents";
import { mockProductOffers } from "@/features/contents/data/mock-product-offers";
import type { ContentViewer } from "@/features/contents/types/content-viewer";
import { canViewContent } from "@/features/contents/utils/content-access";
import {
  isListedPublishedContent,
  isPubliclyAccessibleContentMetadata,
} from "@/features/contents/utils/content-publication";

const browserMockViewer: ContentViewer = {
  user: {
    name: "山田 太郎",
    email: "taro.yamada@example.com",
    avatar: "/images/avatars/avatar-06.jpg",
    initials: "山田",
    membership: "プレミアム会員",
    role: "member",
  },
  plan: "premium",
  purchasedProductIds: [],
};

/**
 * browser worker 用の client-safe contents handlers。
 *
 * Server Component 側の auth service や server repository は client bundle へ入れず、
 * 開発中の browser fetch mock に必要な response shape だけを返す。
 */
export const browserContentHandlers = [
  http.get("*/api/contents", () =>
    HttpResponse.json(mockContents.filter(isListedPublishedContent))
  ),

  http.get("*/api/contents/:id/metadata", ({ params }) => {
    const content = mockContents.find((item) => item.id === String(params.id));

    if (!content) {
      return HttpResponse.json({ error: "Content not found" }, { status: 404 });
    }

    return HttpResponse.json(content);
  }),

  http.get("*/api/contents/:id/preview", ({ params }) => {
    const content = mockContents.find((item) => item.id === String(params.id));

    if (!content) {
      return HttpResponse.json(
        { error: "Content preview not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      id: content.id,
      introduction: content.description,
    });
  }),

  http.get("*/api/contents/:id/detail", ({ params }) => {
    const id = String(params.id);
    const metadata = mockContents.find((item) => item.id === id);

    if (!metadata || !isPubliclyAccessibleContentMetadata(metadata)) {
      return HttpResponse.json(
        { error: "Content detail not found" },
        { status: 404 }
      );
    }

    const decision = canViewContent(metadata.accessPolicy, browserMockViewer);

    if (!decision.allowed) {
      return HttpResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const detail = mockContentDetails[id];

    if (!detail) {
      return HttpResponse.json(
        { error: "Content detail not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(detail);
  }),

  http.get("*/api/contents/:id/related", ({ params, request }) => {
    const { searchParams } = new URL(request.url);
    const requestedLimit = Number(searchParams.get("limit") ?? 4);
    const limit = Number.isFinite(requestedLimit) ? requestedLimit : 4;
    const contents = mockContents
      .filter(isListedPublishedContent)
      .filter((item) => item.id !== String(params.id))
      .slice(0, limit);

    return HttpResponse.json(contents);
  }),

  http.get("*/api/product-offers/:productId", ({ params }) => {
    const offer = mockProductOffers[String(params.productId)];

    if (!offer) {
      return HttpResponse.json(
        { error: "Product offer not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(offer);
  }),
];
