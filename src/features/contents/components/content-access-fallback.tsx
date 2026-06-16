import type { ArticleContent } from "@/features/contents/types/content";

/**
 * コンテンツ詳細の認可 slot が解決するまで表示する静的 fallback。
 *
 * @param content 認可前に取得済みの記事 metadata。
 * @returns 本文領域の高さを確保する loading UI。
 */
export function ContentAccessFallback({ content }: { content: ArticleContent }) {
  return (
    <article className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          {content.title}
        </p>
        <div className="h-8 w-3/4 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="h-64 animate-pulse rounded-lg bg-muted" />
    </article>
  );
}
