import { mockContents } from "@/features/contents/data/mock-contents";
import type { Content } from "@/features/contents/types/content";
import { isListedPublishedContent } from "@/features/contents/utils/content-publication";

/**
 * 一覧（カタログ）に掲載するコンテンツを返す。
 *
 * DB・バックエンド未確定のため、現時点では静的モックを返す。ページ側が
 * モックデータの所在を直接知らないようにするための API abstraction。
 * 掲載対象は published かつ listed のものに限定し、draft / scheduled /
 * archived / unlisted / hidden は一覧に出さない。
 *
 * @returns 掲載対象のコンテンツ一覧
 */
export function getContents(): Content[] {
  return mockContents.filter(isListedPublishedContent);
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
 * 関連枠に下書きや非掲載が混ざらないよう、一覧と同じ掲載条件
 * （published かつ listed）で絞り込む。
 *
 * @param id 現在表示中のコンテンツ id
 * @param limit 返却件数の上限
 * @returns 関連コンテンツ一覧
 */
export function getRelatedContents(id: string, limit = 4): Content[] {
  return mockContents
    .filter((item) => item.id !== id)
    .filter(isListedPublishedContent)
    .slice(0, limit);
}
