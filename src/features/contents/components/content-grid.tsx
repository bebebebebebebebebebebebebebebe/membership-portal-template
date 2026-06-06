import type { Content } from "@/features/contents/types/content";
import { ContentCard } from "@/features/contents/components/content-card";

/**
 * コンテンツカードのレスポンシブグリッド。
 * モバイル 1 列 / タブレット 2 列 / デスクトップ 3 列の 3 ブレークポイント。
 */
export function ContentGrid({ contents }: { contents: Content[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {contents.map((content, index) => (
        <ContentCard
          key={content.id}
          content={content}
          imageLoading={index === 0 ? "eager" : undefined}
        />
      ))}
    </div>
  );
}
