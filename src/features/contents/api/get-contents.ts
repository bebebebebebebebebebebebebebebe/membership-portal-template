import { mockContents } from "@/features/contents/data/mock-contents";
import type { Content } from "@/features/contents/types/content";

/**
 * コンテンツ一覧を返す。
 *
 * DB・バックエンド未確定のため、現時点では静的モックを返す。ページ側が
 * モックデータの所在を直接知らないようにするための API abstraction。
 *
 * @returns コンテンツ一覧
 */
export function getContents(): Content[] {
  return mockContents;
}

/**
 * id に一致するコンテンツを返す。
 *
 * @param id コンテンツ id
 * @returns 一致するコンテンツ。存在しなければ `undefined`
 */
export function getContentById(id: string): Content | undefined {
  return mockContents.find((item) => item.id === id);
}

/**
 * 指定 id を除外した関連コンテンツを返す。
 *
 * @param id 現在表示中のコンテンツ id
 * @param limit 返却件数の上限
 * @returns 関連コンテンツ一覧
 */
export function getRelatedContents(id: string, limit = 4): Content[] {
  return mockContents.filter((item) => item.id !== id).slice(0, limit);
}
