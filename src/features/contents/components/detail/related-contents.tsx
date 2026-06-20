import Link from "next/link";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { Content } from "@/features/contents/types/content";
import { Button } from "@/components/ui/button";
import { RelatedContentCard } from "@/features/contents/components/detail/related-content-card";

/**
 * 全幅「関連コンテンツ」セクション。見出し＋「すべて見る」リンク＋コンパクトカードのグリッド。
 *
 * @param contents - 表示する関連コンテンツ（呼び出し側で現在記事を除外済み）
 */
export function RelatedContents({ contents }: { contents: Content[] }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">関連コンテンツ</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/contents">
            すべて見る
            <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {contents.map((content) => (
          <RelatedContentCard key={content.id} content={content} />
        ))}
      </div>
    </section>
  );
}
