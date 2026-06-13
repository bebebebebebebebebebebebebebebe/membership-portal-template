import { Fragment } from "react";

import type { Content } from "@/features/contents/types/content";
import { ContentCard } from "@/features/contents/components/content-card";

/**
 * コンテンツカードのレスポンシブグリッド。
 * モバイル 1 列 / タブレット 2 列 / デスクトップ 3 列の 3 ブレークポイント。
 */
export async function ContentGrid({ contents }: { contents: Content[] }) {
  const cards = await Promise.all(
    contents.map((content, index) =>
      ContentCard({
        content,
        imageLoading: index === 0 ? "eager" : undefined,
      })
    )
  );

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <Fragment key={contents[index]?.id}>{card}</Fragment>
      ))}
    </div>
  );
}
