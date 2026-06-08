import { ContentAccessBadge } from "@/features/contents/components/content-access-badge";
import type { Content } from "@/features/contents/types/content";
import { getContentAccessHelpText } from "@/features/contents/utils/content-access-display";

/**
 * access indicator の入力。
 *
 * policy だけでなく content 全体を受け取るのは、将来 title / productId /
 * requiredPlans / publicationStatus を使った補足表示へ拡張しやすくするため。
 * Milestone 4 では category ごとの文言分岐はしない。
 *
 * @param content 表示対象コンテンツ
 */
export type ContentAccessIndicatorProps = {
  content: Content;
};

/**
 * 一覧カード本文に表示する閲覧条件の表示ブロック。
 *
 * access badge（短い状態表示）と補助文（必要条件の説明）を縦に並べる。
 */
export function ContentAccessIndicator({ content }: ContentAccessIndicatorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div>
        <ContentAccessBadge policy={content.accessPolicy} />
      </div>
      <p className="text-xs text-muted-foreground">
        {getContentAccessHelpText(content.accessPolicy)}
      </p>
    </div>
  );
}
