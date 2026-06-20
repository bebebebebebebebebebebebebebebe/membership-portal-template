import { ContentCard } from "@/features/contents/components/content-card";
import type { ContentCatalogItem } from "@/features/contents/types/content-catalog";

/**
 * コンテンツカードのレスポンシブグリッド。
 * モバイル 1 列 / タブレット 2 列 / デスクトップ 3 列の 3 ブレークポイント。
 *
 * @param items - 価格 offer を解決済みのカタログ項目（カード側で追加取得しない）
 */
export function ContentGrid({ items }: { items: ContentCatalogItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ content, offer }, index) => (
        <ContentCard
          key={content.id}
          content={content}
          offer={offer}
          imageLoading={index === 0 ? "eager" : undefined}
        />
      ))}
    </div>
  );
}
