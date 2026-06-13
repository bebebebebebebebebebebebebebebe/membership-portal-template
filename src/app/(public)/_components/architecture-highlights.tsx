import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * 設計上のハイライトを説明するセクション。
 *
 * feature-based architecture / accessPolicy / ProductOffer / データ境界 /
 * Route Guard と Content Gate の分離という、保守性・拡張性に関わる設計判断を概観できるようにする。
 */
const highlights: { title: string; description: string }[] = [
  {
    title: "Feature-based architecture",
    description:
      "コンテンツ機能の API・型・UI・ロジックを features/contents に閉じ、app 層は合成に集中します。",
  },
  {
    title: "accessPolicy",
    description:
      "閲覧条件を判別ユニオンで表現し、表示文言や価格を持たせず判定に必要な情報だけを保持します。",
  },
  {
    title: "ProductOffer の分離",
    description:
      "価格は accessPolicy ではなく ProductOffer から取得し、閲覧条件と販売条件を分離します。",
  },
  {
    title: "データ境界",
    description:
      "metadata・preview は認可前に取得し、full body を含む detail は認可後にのみ取得します。",
  },
  {
    title: "Route Guard と Content Gate",
    description:
      "領域への入場制御（Route Guard）と本文の閲覧制御（Content Gate）を分離します。",
  },
];

export function ArchitectureHighlights() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">アーキテクチャ</h2>
        <p className="text-muted-foreground">
          機能ごとに閉じた構成と、認可・データ境界の明確な分離を重視しています。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((highlight) => (
          <Card key={highlight.title}>
            <CardHeader>
              <CardTitle className="text-base">{highlight.title}</CardTitle>
              <CardDescription>{highlight.description}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>
    </section>
  );
}
