import Image from "next/image";
import {
  Bookmark02Icon,
  Calendar03Icon,
  Clock01Icon,
  Download01Icon,
  File01Icon,
  Pdf01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { ContentActionFooter } from "@/features/contents/components/content-action-footer";
import { categoryMeta } from "@/features/contents/constants/content-category";
import type { Content } from "@/features/contents/types/content";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

/** 著者アバターと名前（記事カードのフッター要素）。 */
function AuthorMeta({
  author,
}: {
  author: { name: string; avatar: string; initials: string };
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Avatar className="size-6">
        <AvatarImage src={author.avatar} alt={author.name} />
        <AvatarFallback>{author.initials}</AvatarFallback>
      </Avatar>
      <span className="truncate">{author.name}</span>
    </div>
  );
}

/** アイコン + テキストの 1 メタ項目。 */
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
 * 種別ごとに異なるフッターのメタ情報を出し分ける。
 * 記事=著者/日付/読了時間、資料=形式/ページ数/DL数。
 */
function ContentMeta({ content }: { content: Content }) {
  switch (content.category) {
    case "記事":
      return (
        <>
          <AuthorMeta author={content.author} />
          <div className="flex shrink-0 items-center gap-3">
            <MetaItem icon={Calendar03Icon}>{content.date}</MetaItem>
            <MetaItem icon={Clock01Icon}>{content.readMinutes}分</MetaItem>
          </div>
        </>
      );
    case "資料": {
      const fileIconColor =
        content.fileFormat === "PDF"
          ? "text-red-500"
          : content.fileFormat === "XLSX"
          ? "text-green-600"
          : "text-muted-foreground";
      const fileIcon = content.fileFormat === "PDF" ? Pdf01Icon : File01Icon;
      return (
        <>
          <span className={cn("flex items-center gap-1 font-medium", fileIconColor)}>
            <HugeiconsIcon icon={fileIcon} className="size-4" />
            {content.fileFormat}
          </span>
          <div className="flex shrink-0 items-center gap-3">
            <MetaItem icon={File01Icon}>{content.pageCount}ページ</MetaItem>
            <MetaItem icon={Download01Icon}>
              {content.downloadCount.toLocaleString("ja-JP")}
            </MetaItem>
          </div>
        </>
      );
    }
  }
}

/** コンテンツカードのサムネイル読み込み方針。 */
export type ContentCardImageLoading = "eager" | "lazy";

/**
 * コンテンツ一覧カードの入力。
 *
 * @param content 表示するコンテンツ本文・メタ情報
 * @param imageLoading 初期表示内の LCP 候補だけ即時読み込みするための画像読み込み方針
 */
export type ContentCardProps = {
  content: Content;
  imageLoading?: ContentCardImageLoading;
};

/**
 * コンテンツ一覧の 1 カード。
 *
 * サムネイル（左上に種別色 Badge、右上にブックマークボタン、資料は形式ラベル）・
 * タイトル・説明・タグ行・種別別フッターで構成する。閲覧条件と CTA は本文から分離し、
 * footer の `ContentActionFooter` に「閲覧条件 + 行動」として集約する。
 * `imageLoading` は一覧先頭など above-the-fold の LCP 候補だけ eager にする。
 */
export function ContentCard({ content, imageLoading }: ContentCardProps) {
  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden pt-0">
      <div className="relative aspect-video">
        <Image
          src={content.thumbnail}
          alt={content.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          loading={imageLoading}
        />
        <Badge
          className={cn("absolute left-3 top-3", categoryMeta[content.category].badgeClass)}
        >
          {content.category}
        </Badge>
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-3 top-3 size-8 rounded-full bg-background/80 shadow-sm ring-1 ring-black/5 backdrop-blur"
          aria-label="ブックマーク"
        >
          <HugeiconsIcon icon={Bookmark02Icon} />
        </Button>
        {content.category === "資料" && (
          <span className="absolute bottom-3 right-3 rounded-md bg-background/90 px-2 py-0.5 text-xs font-semibold text-red-500">
            {content.fileFormat}
          </span>
        )}
      </div>

      <CardHeader className="pt-6">
        <CardTitle className="line-clamp-2 leading-snug">{content.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {content.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="flex flex-wrap gap-1.5">
          {content.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={cn(
                "rounded-md px-2 py-0.5 text-xs font-normal",
                categoryMeta[content.category].tagClass
              )}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex-col items-stretch gap-3 pt-3">
        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <ContentMeta content={content} />
        </div>
        <ContentActionFooter content={content} />
      </CardFooter>
    </Card>
  );
}
