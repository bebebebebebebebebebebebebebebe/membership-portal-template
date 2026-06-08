import type { Content } from "@/features/contents/types/content";

/**
 * コンテンツが一覧（カタログ）に掲載される対象かを判定する。
 *
 * 「公開されているか（publicationStatus）」と「一覧に出るか（discoverability）」は
 * 別概念なので両方を満たすものだけを掲載対象とする。draft / scheduled / archived や
 * unlisted / hidden は URL 直アクセスで扱い、一覧には出さない。
 *
 * @param content 判定対象のコンテンツ
 * @returns published かつ listed のとき true
 */
export function isListedPublishedContent(content: Content): boolean {
  return (
    content.publicationStatus === "published" &&
    content.discoverability === "listed"
  );
}
