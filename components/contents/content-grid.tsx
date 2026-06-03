import type { Content } from "@/lib/mock/contents";
import { ContentCard } from "@/components/contents/content-card";

/**
 * コンテンツカードのレスポンシブグリッド。
 * モバイル 1 列 / タブレット 2 列 / デスクトップ 3 列の 3 ブレークポイント。
 */
export function ContentGrid({ contents }: { contents: Content[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {contents.map((content) => (
        <ContentCard key={content.id} content={content} />
      ))}
    </div>
  );
}
