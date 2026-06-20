import type { TocItem } from "@/features/contents/types/content-detail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 右レール「目次」カード。
 *
 * 目次項目を本文セクションのアンカー（`#overview` 等）へのリンクとして描画する。
 * `children` を持つ項目は番号付きサブ項目をインデント表示する。先頭項目を
 * アクティブ色（ティール）で強調し、現在位置の目安とする（静的表現）。
 *
 * @param items - 目次項目（本文セクションの id と対応）
 */
export function ArticleToc({ items }: { items: TocItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">目次</CardTitle>
      </CardHeader>
      <CardContent>
        <nav>
          <ul className="flex flex-col gap-2 text-sm">
            {items.map((item, index) => (
              <li key={item.id} className="flex flex-col gap-2">
                <a
                  href={`#${item.id}`}
                  className={
                    index === 0
                      ? "font-medium text-primary"
                      : "text-muted-foreground transition-colors hover:text-foreground"
                  }
                >
                  {item.label}
                </a>
                {item.children && (
                  <ol className="ml-4 flex flex-col gap-2 text-muted-foreground">
                    {item.children.map((child, childIndex) => (
                      <li key={child.label} className="flex gap-2">
                        <span className="tabular-nums">{childIndex + 1}.</span>
                        <span>{child.label}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  );
}
