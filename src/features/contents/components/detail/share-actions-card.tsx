import {
  Bookmark02Icon,
  Flag02Icon,
  Link01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 右レール「共有・保存」カード。
 * リンクをコピー・ブックマークに追加・このコンテンツを報告 の操作を縦並びの ghost ボタンで提供する。
 * 静的 UI のためハンドラは持たない見た目のみのモック。
 */
export function ShareActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">共有・保存</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <Button variant="ghost" className="justify-start">
          <HugeiconsIcon icon={Link01Icon} data-icon="inline-start" />
          リンクをコピー
        </Button>
        <Button variant="ghost" className="justify-start">
          <HugeiconsIcon icon={Bookmark02Icon} data-icon="inline-start" />
          ブックマークに追加
        </Button>
        <Button variant="ghost" className="justify-start">
          <HugeiconsIcon icon={Flag02Icon} data-icon="inline-start" />
          このコンテンツを報告
        </Button>
      </CardContent>
    </Card>
  );
}
