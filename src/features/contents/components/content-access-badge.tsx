import {
  contentAccessBadgeVariants,
  contentAccessLabels,
} from "@/features/contents/constants/content-access";
import type { ContentAccessPolicy } from "@/features/contents/types/content-access";
import { Badge } from "@/components/ui/badge";

/**
 * access badge の入力。
 *
 * @param policy 表示対象コンテンツの閲覧条件
 */
export type ContentAccessBadgeProps = {
  policy: ContentAccessPolicy;
};

/**
 * 閲覧条件を短い状態表示として示す badge。
 *
 * 表示文言・variant は constants に集約し、ここでは kind から引くだけにする。
 * category には依存しない。
 */
export function ContentAccessBadge({ policy }: ContentAccessBadgeProps) {
  return (
    <Badge variant={contentAccessBadgeVariants[policy.kind]}>
      {contentAccessLabels[policy.kind]}
    </Badge>
  );
}
