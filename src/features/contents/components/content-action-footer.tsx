import Link from "next/link";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { Content } from "@/features/contents/types/content";
import type { ProductOffer } from "@/features/contents/types/product-offer";
import { getContentActionDisplay } from "@/features/contents/utils/content-access-display";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * action footer の入力。
 *
 * policy だけでなく content 全体を受け取るのは、id（CTA リンク先）など複数フィールドを
 * 使うため。価格は呼び出し側で解決済みの `offer` を受け取り、component からはデータ取得しない。
 *
 * @param content 表示対象コンテンツ
 * @param offer 単品購入を含む kind で解決済みの販売 offer（不要な kind では undefined）
 */
export type ContentActionFooterProps = {
  content: Content;
  offer?: ProductOffer;
};

/**
 * 一覧カード下部の「閲覧条件 + CTA」アクション領域。
 *
 * 価格は解決済みの `offer`（`ProductOffer`）から導出する（component からデータ取得しない）。
 * `conditionLabel` がある kind だけ panel（枠・背景）を出し、`free` は CTA だけを置いて
 * 本文・footer をすっきりさせる。CTA 色は category / access kind で分岐させず
 * `variant="outline"` に統一する。
 */
export function ContentActionFooter({ content, offer }: ContentActionFooterProps) {
  const display = getContentActionDisplay(content.accessPolicy, offer);

  const hasCondition = Boolean(display.conditionLabel);

  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        hasCondition && "rounded-xl border bg-muted/40 p-3"
      )}
    >
      {display.conditionLabel ? (
        <div className="flex min-w-0 items-center gap-2 text-xs">
          <Badge
            variant="secondary"
            className="shrink-0 rounded-md px-2 py-0.5 font-medium"
          >
            閲覧条件
          </Badge>
          <span className="min-w-0 break-words font-semibold leading-tight text-foreground">
            {display.conditionLabel}
          </span>
        </div>
      ) : null}

      <Button variant="outline" className="w-full py-4" asChild>
        <Link href={`/contents/${content.id}`}>
          {display.actionLabel}
          <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
        </Link>
      </Button>
    </div>
  );
}
