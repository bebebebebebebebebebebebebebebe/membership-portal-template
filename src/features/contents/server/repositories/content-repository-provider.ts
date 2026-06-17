import "server-only";

import type { ContentRepository } from "@/features/contents/services/content-repository";
import { mockContentRepository } from "@/features/contents/server/repositories/mock-content-repository";

/**
 * contents feature で使う repository 実装を返す。
 *
 * 現時点では mock 実装だけを返す。DB 実装へ移行する場合は、この provider の差し替えだけで
 * app / Route Handler / Server Component から mock 実装を隠蔽したまま切り替える。
 *
 * @returns 現在有効な contents repository。
 */
export function getContentRepository(): ContentRepository {
  return mockContentRepository;
}
