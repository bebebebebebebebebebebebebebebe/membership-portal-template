import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * access badge の入力。
 *
 * 文言・variant の決定は呼び出し側（display model）に委ね、表示だけを担う。
 *
 * @param label 表示するアクセス文言（例: `無料`, `有料プラン`, `1,980円`）
 */
export type ContentAccessBadgeProps = {
  label: string;
};

/**
 * アクセス文言を短い状態表示として示す badge。
 *
 * 分類タグ（淡色背景・通常太さ）と区別できるよう、中立背景＋枠線＋太字で対比させ、
 * 閲覧条件・価格が意思決定に関わる情報だと一目で伝わるようにする。
 * `有料プランまたは2,480円` のような長いラベルでも狭幅で折り返せるよう、
 * Badge ベースの固定高さ・nowrap・clip を解除する。
 */
export function ContentAccessBadge({ label }: ContentAccessBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        // 分類タグとの視覚差: 中立背景・はっきりした枠線・太字
        "border-muted-foreground/30 bg-background font-semibold text-foreground dark:bg-background",
        // 価格・条件の視認性を少し上げる
        "text-xs",
        // 長いラベルの折り返し耐性（固定高さ・nowrap・clip・pill を解除）
        "h-auto max-w-full overflow-visible rounded-md whitespace-normal text-left leading-snug"
      )}
    >
      {label}
    </Badge>
  );
}
