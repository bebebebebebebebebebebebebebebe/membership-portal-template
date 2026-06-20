import { http, HttpResponse } from "msw";

import {
  getAuthorizedContentDetail,
  getContentCatalogItems,
  getProductOffer,
  getPublicContentMetadata,
  getPublicContentPreview,
  getPublicRelatedContents,
} from "@/features/contents/server/content-read-queries";
import { getContentViewer } from "@/features/contents/server/content-viewer";

/**
 * contents feature の HTTP API mock handlers。
 *
 * Route Handler と同じ server service を使い、Vitest でも実行時 API と同じ
 * response shape / status code を検証できるようにする。
 */
export const contentHandlers = [
  http.get("*/api/contents", async () => {
    const items = await getContentCatalogItems();

    return HttpResponse.json(items.map((item) => item.content));
  }),

  http.get("*/api/contents/:id/metadata", async ({ params }) => {
    const content = await getPublicContentMetadata(String(params.id));

    if (!content) {
      return HttpResponse.json({ error: "Content not found" }, { status: 404 });
    }

    return HttpResponse.json(content);
  }),

  http.get("*/api/contents/:id/preview", async ({ params }) => {
    const preview = await getPublicContentPreview(String(params.id));

    if (!preview) {
      return HttpResponse.json(
        { error: "Content preview not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(preview);
  }),

  http.get("*/api/contents/:id/detail", async ({ params }) => {
    const viewer = await getContentViewer();
    const result = await getAuthorizedContentDetail(String(params.id), viewer);

    switch (result.status) {
      case "ok":
        return HttpResponse.json(result.detail);
      case "forbidden":
        return HttpResponse.json({ error: "Forbidden" }, { status: 403 });
      case "notFound":
        return HttpResponse.json(
          { error: "Content detail not found" },
          { status: 404 }
        );
    }
  }),

  http.get("*/api/contents/:id/related", async ({ params, request }) => {
    const { searchParams } = new URL(request.url);
    const requestedLimit = Number(searchParams.get("limit") ?? 4);
    const limit = Number.isFinite(requestedLimit) ? requestedLimit : 4;

    return HttpResponse.json(
      await getPublicRelatedContents(String(params.id), limit)
    );
  }),

  http.get("*/api/product-offers/:productId", async ({ params }) => {
    const offer = await getProductOffer(String(params.productId));

    if (!offer) {
      return HttpResponse.json(
        { error: "Product offer not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(offer);
  }),
];
