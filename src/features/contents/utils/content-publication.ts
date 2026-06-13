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

/**
 * コンテンツが URL 直アクセスで詳細ページを開ける対象かを判定する。
 *
 * 一覧掲載（listed）より緩く、published かつ hidden でないものを許可する。
 * これにより listed / unlisted は URL を知っていれば閲覧でき、draft / scheduled /
 * archived や hidden は直アクセスでも `notFound()` に落とせる。本文の閲覧可否
 * （accessPolicy 判定）はこの後段の Content Gate が別途扱う。
 *
 * @param content 判定対象のコンテンツメタデータ
 * @returns published かつ discoverability が hidden でないとき true
 */
export function isPubliclyAccessibleContentMetadata(content: Content): boolean {
  return (
    content.publicationStatus === "published" &&
    content.discoverability !== "hidden"
  );
}
