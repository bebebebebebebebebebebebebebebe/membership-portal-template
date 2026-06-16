import { http, HttpResponse } from "msw";

import { getContentViewer } from "@/features/contents/server/content-viewer";
import {
  getMockContentDetailForViewer,
  getMockContentMetadata,
  getMockContentPreview,
  getMockContents,
  getMockProductOffer,
  getMockRelatedContents,
} from "@/features/contents/server/mock-content-repository";

/**
 * contents feature の HTTP API mock handlers。
 *
 * Route Handler と同じ mock repository を使い、Vitest でも実行時 API と同じ
 * response shape / status code を検証できるようにする。
 */
export const contentHandlers = [
  http.get("*/api/contents", () => HttpResponse.json(getMockContents())),

  http.get("*/api/contents/:id/metadata", ({ params }) => {
    const content = getMockContentMetadata(String(params.id));

    if (!content) {
      return HttpResponse.json({ error: "Content not found" }, { status: 404 });
    }

    return HttpResponse.json(content);
  }),

  http.get("*/api/contents/:id/preview", ({ params }) => {
    const preview = getMockContentPreview(String(params.id));

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
    const result = getMockContentDetailForViewer(String(params.id), viewer);

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

  http.get("*/api/contents/:id/related", ({ params, request }) => {
    const { searchParams } = new URL(request.url);
    const requestedLimit = Number(searchParams.get("limit") ?? 4);
    const limit = Number.isFinite(requestedLimit) ? requestedLimit : 4;

    return HttpResponse.json(getMockRelatedContents(String(params.id), limit));
  }),

  http.get("*/api/product-offers/:productId", ({ params }) => {
    const offer = getMockProductOffer(String(params.productId));

    if (!offer) {
      return HttpResponse.json(
        { error: "Product offer not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(offer);
  }),
];
