import Link from "next/link";
import Image from "next/image";
import { Bookmark02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { Content } from "@/features/contents/types/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * 関連コンテンツ用のコンパクトカード（汎用 CMS）。
 *
 * 一覧の ContentCard と異なり説明文・「詳細を見る」ボタンを持たず、
 * サムネ（ブックマーク）・タイトル・タグのみで構成する。content type 固有のメタは持たない。
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
        <div className="flex flex-wrap gap-1.5">
          {content.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-md px-2 py-0.5 text-xs font-normal"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
