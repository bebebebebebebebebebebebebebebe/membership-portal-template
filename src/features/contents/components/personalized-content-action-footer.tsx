import { ContentActionFooter } from "@/features/contents/components/content-action-footer";
import { getContentViewer } from "@/features/contents/server/content-viewer";
import type { Content } from "@/features/contents/types/content";
import type { ProductOffer } from "@/features/contents/types/product-offer";

/**
 * personalized footer slot の入力。
 *
 * catalog item 側で解決済みの content / offer だけを受け取り、viewer はこの Server Component 内で
 * 解決する。これによりカード本体の静的 shell と認証依存 CTA を分離する。
 */
export type PersonalizedContentActionFooterProps = {
  content: Content;
  offer?: ProductOffer;
};

/**
 * コンテンツ一覧カード下部の認証依存 CTA slot。
 *
 * サーバー側で `ContentViewer` を組み立て、`ContentActionFooter` に plain object として渡す。
 * 本文データの取得や最終認可は行わず、catalog UI の文言最適化だけを担当する。
 *
 * @param props - 表示対象の content と、必要な場合に解決済みの販売 offer。
 * @returns viewer の権限に応じた一覧カード footer。
 */
export async function PersonalizedContentActionFooter(
  props: PersonalizedContentActionFooterProps
) {
  const viewer = await getContentViewer();

  return <ContentActionFooter {...props} viewer={viewer} />;
}
