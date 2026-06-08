import { mockContentDetails } from "@/features/contents/data/mock-content-details";
import type { ContentDetail } from "@/features/contents/types/content-detail";

/**
 * 指定 id の full detail を返す。
 *
 * 本文セクションやコメントを含むため、呼び出し側で accessPolicy の判定に通った後だけ使う。
 *
 * @param id 一覧コンテンツの id。
 * @returns 記事詳細データ。存在しなければ `undefined`。
 */
export function getContentDetail(id: string): ContentDetail | undefined {
  return mockContentDetails[id];
}
