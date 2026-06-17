import { http, HttpResponse } from "msw";

import { createContentReadService } from "@/features/contents/services/content-read-service";
import { getBrowserMockViewer } from "@/testing/mocks/auth-scenario";
import { browserMockContentRepository } from "@/testing/mocks/browser-content-repository";

const contentReadService = createContentReadService(browserMockContentRepository);

/**
 * browser worker 用の client-safe contents handlers。
 *
 * Server Component 側の auth service や server repository は client bundle へ入れず、
 * content read service に browser-safe repository / viewer を注入して Route Handler と
 * 同じ response shape を返す。
 */
export const browserContentHandlers = [
  http.get("*/api/contents", async () => {
    const items = await contentReadService.getContentCatalogItems();

    return HttpResponse.json(items.map((item) => item.content));
  }),

  http.get("*/api/contents/:id/metadata", async ({ params }) => {
    const content = await contentReadService.getPublicContentMetadata(
      String(params.id)
    );

    if (!content) {
      return HttpResponse.json({ error: "Content not found" }, { status: 404 });
    }

    return HttpResponse.json(content);
  }),

  http.get("*/api/contents/:id/preview", async ({ params }) => {
    const preview = await contentReadService.getPublicContentPreview(
      String(params.id)
    );

    if (!preview) {
      return HttpResponse.json(
        { error: "Content preview not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(preview);
  }),

  http.get("*/api/contents/:id/detail", async ({ params }) => {
    const viewer = getBrowserMockViewer();
    const result = await contentReadService.getAuthorizedContentDetail(
      String(params.id),
      viewer
    );

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
      await contentReadService.getPublicRelatedContents(String(params.id), limit)
    );
  }),

  http.get("*/api/product-offers/:productId", async ({ params }) => {
    const offer = await contentReadService.getProductOffer(
      String(params.productId)
    );

    if (!offer) {
      return HttpResponse.json(
        { error: "Product offer not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(offer);
  }),
];
