import Link from "next/link";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { getProductOffer } from "@/features/contents/api/get-product-offer";
import type { Content } from "@/features/contents/types/content";
import { getContentActionDisplay } from "@/features/contents/utils/content-access-display";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * action footer の入力。
 *
 * policy だけでなく content 全体を受け取るのは、id（CTA リンク先）や
 * productId（価格解決）など複数フィールドを使うため。
 *
 * @param content 表示対象コンテンツ
 */
export type ContentActionFooterProps = {
  content: Content;
};

/**
 * accessPolicy から販売オファー解決に使う productId を取り出す。
 *
 * 価格表示が必要なのは単品購入を含む kind だけなので、それ以外は `null` を返す。
 */
function getProductIdForAccess(policy: Content["accessPolicy"]): string | null {
  switch (policy.kind) {
    case "purchaseRequired":
    case "planOrPurchase":
      return policy.productId;
    default:
      return null;
  }
}

/**
 * 一覧カード下部の「閲覧条件 + CTA」アクション領域。
 *
 * 価格は `accessPolicy` ではなく `getProductOffer()` 経由の `ProductOffer` から導出する
 * （component から mock を直接 import しない）。`conditionLabel` がある kind だけ
 * panel（枠・背景）を出し、`free` は CTA だけを置いて本文・footer をすっきりさせる。
 * CTA 色は category / access kind で分岐させず `variant="outline"` に統一する。
 */
export async function ContentActionFooter({ content }: ContentActionFooterProps) {
  const productId = getProductIdForAccess(content.accessPolicy);
  const offer = productId ? await getProductOffer(productId) : undefined;
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
