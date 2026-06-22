import {
  Calendar03Icon,
  Download01Icon,
  MoreVerticalIcon,
  Share08Icon,
  StarIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { Content } from "@/features/contents/types/content";
import type { ContentDetail } from "@/features/contents/types/content-detail";
import { Button } from "@/components/ui/button";

/** メタ行のアイコン + テキスト 1 項目。 */
function MetaItem({
  icon,
  children,
}: {
  icon: typeof Calendar03Icon;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1 tabular-nums">
      <HugeiconsIcon icon={icon} className="size-4" />
      {children}
    </span>
  );
}

/**
 * コンテンツ詳細ページのヘッダー。
 *
 * タイトル・サブタイトル・アクション（お気に入り登録 / 共有 / その他）を上段に、
 * 公開日・閲覧数・更新日のメタ行を下段に配置する。content type 固有のメタ（著者・読了時間など）
 * は持たない汎用 CMS ヘッダー。静的 UI のためアクションはハンドラを持たない見た目のみのモック。
 */
export function DetailHeader({
  content,
  detail,
}: {
  content: Content;
  detail: ContentDetail;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {content.title}
          </h1>
          <p className="text-muted-foreground">{content.description}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button>
            <HugeiconsIcon
              icon={StarIcon}
              data-icon="inline-start"
              className="text-amber-300"
            />
            お気に入り登録
          </Button>
          <Button variant="outline">
            <HugeiconsIcon icon={Share08Icon} data-icon="inline-start" />
            共有
          </Button>
          <Button variant="outline" size="icon" aria-label="その他の操作">
            <HugeiconsIcon icon={MoreVerticalIcon} />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <MetaItem icon={Calendar03Icon}>{detail.publishedDate}</MetaItem>
        <MetaItem icon={ViewIcon}>{detail.viewCount.toLocaleString("ja-JP")}</MetaItem>
        <MetaItem icon={Download01Icon}>更新日: {detail.updatedDate}</MetaItem>
      </div>
    </div>
  );
}
