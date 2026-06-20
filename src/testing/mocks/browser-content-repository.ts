import { mockContentDetails } from "@/features/contents/data/mock-content-details";
import { mockContents } from "@/features/contents/data/mock-contents";
import { mockProductOffers } from "@/features/contents/data/mock-product-offers";
import type { ContentRepository } from "@/features/contents/services/content-repository";

/**
 * browser MSW worker で使う client-safe な contents repository。
 *
 * `server-only` module を client bundle に含めないため、testing 層で mock data を
 * `ContentRepository` contract に合わせる。
 */
export const browserMockContentRepository: ContentRepository = {
  /**
   * server-only 実装と同じ raw fixture を、browser bundle で読める形で返す。
   */
  async listContents() {
    return mockContents;
  },

  async findContentById(id) {
    return mockContents.find((item) => item.id === id);
  },

  /**
   * browser MSW 側でも full detail の認可は repository ではなく read service に委譲する。
   */
  async findContentDetailById(id) {
    return mockContentDetails[id];
  },

  async findProductOfferById(productId) {
    return mockProductOffers[productId];
  },
};
