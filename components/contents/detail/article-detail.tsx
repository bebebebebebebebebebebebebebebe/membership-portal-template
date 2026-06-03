import Image from "next/image";

import { categoryMeta, type ArticleContent, type Content } from "@/lib/mock/contents";
import type { ContentDetail } from "@/lib/mock/content-detail";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArticleAboutCard } from "@/components/contents/detail/article-about-card";
import { ArticleBody } from "@/components/contents/detail/article-body";
import { ArticleToc } from "@/components/contents/detail/article-toc";
import { CommentsSection } from "@/components/contents/detail/comments-section";
import { DetailBreadcrumb } from "@/components/contents/detail/detail-breadcrumb";
import { DetailHeader } from "@/components/contents/detail/detail-header";
import { RelatedContents } from "@/components/contents/detail/related-contents";
import { ShareActionsCard } from "@/components/contents/detail/share-actions-card";

/**
 * 記事詳細ページ全体の組み立て。
 *
 * パンくず → ヘッダー → 2カラム（左: hero/本文/タグ、右: この記事について/目次/共有・保存）→
 * 全幅の関連コンテンツ → コメント、の順に縦積みする。Member Zone 共通レイアウトの
 * `main` 内に配置される前提の静的 UI。
 *
 * @param content 記事の一覧用基本データ（タイトル・著者・サムネ・タグ等）
 * @param detail 記事の本文・統計・目次・コメント
 * @param related 関連コンテンツ（現在記事を除外済み）
 */
export function ArticleDetail({
  content,
  detail,
  related,
}: {
  content: ArticleContent;
  detail: ContentDetail;
  related: Content[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <DetailBreadcrumb />
      <DetailHeader content={content} detail={detail} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-6">
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <Image
              src={content.thumbnail}
              alt={content.title}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
              priority
            />
          </div>

          <ArticleBody detail={detail} />

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">タグ</h2>
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
          </section>
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-20 lg:self-start">
          <ArticleAboutCard content={content} detail={detail} />
          <ArticleToc items={detail.toc} />
          <ShareActionsCard />
        </aside>
      </div>

      <RelatedContents contents={related} />
      <CommentsSection comments={detail.comments} />
    </div>
  );
}
