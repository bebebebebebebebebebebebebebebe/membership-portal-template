import { Suspense } from "react";
import Image from "next/image";
import { Bookmark02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { ContentActionFooterFallback } from "@/features/contents/components/content-action-footer";
import { PersonalizedContentActionFooter } from "@/features/contents/components/personalized-content-action-footer";
import type { Content } from "@/features/contents/types/content";
import type { ProductOffer } from "@/features/contents/types/product-offer";
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

/** コンテンツカードのサムネイル読み込み方針。 */
export type ContentCardImageLoading = "eager" | "lazy";

/**
 * コンテンツ一覧カードの入力。
 *
 * @param content - 表示するコンテンツ本文・メタ情報
 * @param offer - 価格表示に使う解決済み販売 offer（不要な kind では undefined）
 * @param imageLoading - 初期表示内の LCP 候補だけ即時読み込みするための画像読み込み方針
 */
export type ContentCardProps = {
  content: Content;
  offer?: ProductOffer;
  imageLoading?: ContentCardImageLoading;
};

/**
 * コンテンツ一覧の 1 カード（汎用 CMS）。
 *
 * サムネイル（右上にブックマークボタン）・タイトル・説明・タグ行・閲覧条件フッターで構成する。
 * content type 固有のメタ（著者・日付・ファイル形式など）は持たず、どの派生先でも使える generic UI。
 * 閲覧条件と CTA は本文から分離し、Suspense 配下の personalized footer slot に集約する。
 * `imageLoading` は一覧先頭など above-the-fold の LCP 候補だけ eager にする。
 */
export function ContentCard({ content, offer, imageLoading }: ContentCardProps) {
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
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-3 top-3 size-8 rounded-full bg-background/80 shadow-sm ring-1 ring-black/5 backdrop-blur"
          aria-label="ブックマーク"
        >
          <HugeiconsIcon icon={Bookmark02Icon} />
        </Button>
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
              className="rounded-md px-2 py-0.5 text-xs font-normal"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex-col items-stretch gap-3 pt-3">
        <Suspense fallback={<ContentActionFooterFallback />}>
          <PersonalizedContentActionFooter content={content} offer={offer} />
        </Suspense>
      </CardFooter>
    </Card>
  );
}
