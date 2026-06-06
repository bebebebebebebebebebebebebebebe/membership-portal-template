import { HugeiconsIcon } from "@hugeicons/react";

import { contentStats } from "@/features/contents/constants/content-stats";
import { cn } from "@/lib/utils";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * コンテンツ一覧上部の統計カード（総コンテンツ / お気に入り / 今週の新着）。
 *
 * デザインに合わせアイコンを左・ラベルと数値を右に置く水平レイアウト。
 * お気に入りのみ装飾色 amber、他はティールの primary。
 */
export function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {contentStats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center gap-4">
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-full",
                stat.accent === "amber"
                  ? "bg-amber-100 text-amber-500"
                  : "bg-primary/10 text-primary"
              )}
            >
              <HugeiconsIcon icon={stat.icon} />
            </div>
            <div className="flex flex-col gap-1">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl tabular-nums">
                {stat.value.toLocaleString("ja-JP")}
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
