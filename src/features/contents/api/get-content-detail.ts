import type { ContentDetail } from "@/features/contents/types/content-detail";
import { fetchOptionalJson } from "@/lib/api/fetch-json";

/**
 * 指定 id の full detail を取得する。
 *
 * 本文セクションやコメントを含むため、HTTP API 側で accessPolicy の判定に
 * 通った場合だけ返る。存在しない場合は `undefined`、閲覧不可の場合は
 * fetch error として呼び出し側に伝播する。
 *
 * @param id 一覧コンテンツの id。
 * @returns 記事詳細データ。存在しなければ `undefined`。
 */
export async function getContentDetail(
  id: string
): Promise<ContentDetail | undefined> {
  return fetchOptionalJson<ContentDetail>(
    `/api/contents/${encodeURIComponent(id)}/detail`
  );
}
