import "server-only";

import { mockContentDetails } from "@/features/contents/data/mock-content-details";
import { mockContents } from "@/features/contents/data/mock-contents";
import { mockProductOffers } from "@/features/contents/data/mock-product-offers";
import type { ContentRepository } from "@/features/contents/services/content-repository";

/**
 * 静的 mock data を読む contents repository 実装。
 *
 * 公開判定や認可判定は行わず、mock data を raw data として返す。将来 DB 実装へ
 * 差し替える場合も同じ `ContentRepository` contract を満たす。
 */
export const mockContentRepository: ContentRepository = {
  /**
   * 静的 fixture を raw metadata として返し、公開判定や認可判定は read service に委譲する。
   */
  async listContents() {
    return mockContents;
  },

  async findContentById(id) {
    return mockContents.find((item) => item.id === id);
  },

  /**
   * full detail の body gate は repository ではなく content read service 側で行う。
   */
  async findContentDetailById(id) {
    return mockContentDetails[id];
  },

  async findProductOfferById(productId) {
    return mockProductOffers[productId];
  },
};
