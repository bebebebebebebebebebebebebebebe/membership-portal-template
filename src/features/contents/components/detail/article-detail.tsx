import Image from "next/image";

import type { Content } from "@/features/contents/types/content";
import type { ContentDetail } from "@/features/contents/types/content-detail";
import type { AuthUser } from "@/types/auth";
import { Badge } from "@/components/ui/badge";
import { ArticleAboutCard } from "@/features/contents/components/detail/article-about-card";
import { ArticleBody } from "@/features/contents/components/detail/article-body";
import { ArticleToc } from "@/features/contents/components/detail/article-toc";
import { CommentsSection } from "@/features/contents/components/detail/comments-section";
import { DetailBreadcrumb } from "@/features/contents/components/detail/detail-breadcrumb";
import { DetailHeader } from "@/features/contents/components/detail/detail-header";
import { RelatedContents } from "@/features/contents/components/detail/related-contents";
import { ShareActionsCard } from "@/features/contents/components/detail/share-actions-card";

export type ArticleDetailProps = {
  content: Content;
  detail: ContentDetail;
  related: Content[];
  currentUser: AuthUser | null;
};

/**
 * コンテンツ詳細ページ全体の組み立て。
 *
 * パンくず → ヘッダー → 2カラム（左: hero/本文/タグ、右: このコンテンツについて/目次/共有・保存）→
 * 全幅の関連コンテンツ → コメント、の順に縦積みする。Member Zone 共通レイアウトの
 * `main` 内に配置される前提の静的 UI。
 *
 * @param props - コンテンツ metadata、本文詳細、関連コンテンツ、コメント欄の viewer 状態。
 */
export function ArticleDetail(props: ArticleDetailProps) {
  const { content, detail, related, currentUser } = props;

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
              preload
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
                  className="rounded-md px-2 py-0.5 text-xs font-normal"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-20 lg:self-start">
          <ArticleAboutCard detail={detail} />
          <ArticleToc items={detail.toc} />
          <ShareActionsCard />
        </aside>
      </div>

      <RelatedContents contents={related} />
      <CommentsSection comments={detail.comments} currentUser={currentUser} />
    </div>
  );
}
