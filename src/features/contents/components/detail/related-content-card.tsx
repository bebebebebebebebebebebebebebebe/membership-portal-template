import Link from "next/link";
import Image from "next/image";
import {
  Bookmark02Icon,
  Calendar03Icon,
  Download01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { categoryMeta } from "@/features/contents/constants/content-category";
import type { Content } from "@/features/contents/types/content";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * 種別に応じたカード下部メタを出し分ける。
 * 記事・投稿は著者＋日付、資料はファイル形式＋ダウンロード数を表示する。
 */
function RelatedMeta({ content }: { content: Content }) {
  if (content.category === "資料") {
    return (
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium">{content.fileFormat}</span>
        <span className="flex items-center gap-1 tabular-nums">
          <HugeiconsIcon icon={Download01Icon} className="size-3.5" />
          {content.downloadCount.toLocaleString("ja-JP")}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
      <span className="flex min-w-0 items-center gap-1.5">
        <Avatar className="size-5">
          <AvatarImage src={content.author.avatar} alt={content.author.name} />
          <AvatarFallback>{content.author.initials}</AvatarFallback>
        </Avatar>
        <span className="truncate">{content.author.name}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1 tabular-nums">
        <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
        {content.date}
      </span>
    </div>
  );
}

/**
 * 関連コンテンツ用のコンパクトカード。
 *
 * 一覧の ContentCard と異なり説明文・「詳細を見る」ボタンを持たず、
 * サムネ（種別バッジ＋ブックマーク）・タイトル・種別別メタのみで構成する。
 */
export function RelatedContentCard({ content }: { content: Content }) {
  return (
    <Card className="gap-0 overflow-hidden pt-0">
      <div className="relative aspect-video">
        <Image
          src={content.thumbnail}
          alt={content.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
        <Badge
          className={cn("absolute left-2 top-2", categoryMeta[content.category].badgeClass)}
        >
          {content.category}
        </Badge>
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-2 top-2 size-7 rounded-full bg-background/80 shadow-sm ring-1 ring-black/5 backdrop-blur"
          aria-label="ブックマーク"
        >
          <HugeiconsIcon icon={Bookmark02Icon} />
        </Button>
      </div>
      <CardContent className="flex flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
          <Link href={`/contents/${content.id}`} className="hover:underline">
            {content.title}
          </Link>
        </h3>
        <RelatedMeta content={content} />
      </CardContent>
    </Card>
  );
}
