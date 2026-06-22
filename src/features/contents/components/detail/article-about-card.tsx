import type { ContentDetail } from "@/features/contents/types/content-detail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** ラベル（左・muted）と値（右）を両端揃えで並べる 1 行。 */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

/**
 * 右レール「このコンテンツについて」カード。
 * 公開日・更新日・閲覧数を一覧表示する。content type 固有のメタ（種別・読了時間など）は持たない。
 */
export function ArticleAboutCard({ detail }: { detail: ContentDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">このコンテンツについて</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <InfoRow label="公開日" value={detail.publishedDate} />
        <InfoRow label="更新日" value={detail.updatedDate} />
        <InfoRow label="閲覧数" value={detail.viewCount.toLocaleString("ja-JP")} />
      </CardContent>
    </Card>
  );
}
