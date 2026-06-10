import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * ポータルのゾーン構成を説明するセクション。
 *
 * Public（公開）/ Content Catalog（公開カタログ）/ Member（認証必須）/ Admin（管理者）の
 * 4 区分を示し、Route Guard と Content Gate を分離する設計方針を概観できるようにする。
 */
const zones: { title: string; description: string }[] = [
  {
    title: "Public Zone",
    description: "認証不要のトップ・集客・認証導線。",
  },
  {
    title: "Content Catalog",
    description:
      "非会員も閲覧できる公開カタログ。本文の閲覧可否は Content Gate で個別に判定します。",
  },
  {
    title: "Member Zone",
    description:
      "ログイン必須のダッシュボード・お気に入り・通知・設定。Route Guard で領域を保護します。",
  },
  {
    title: "Admin Zone",
    description: "管理者専用のコンテンツ管理。RBAC で制御します。",
  },
];

export function ZoneOverview() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">ゾーン構成</h2>
        <p className="text-muted-foreground">
          領域への入場（Route Guard）と本文の閲覧（Content Gate）を分けて制御します。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {zones.map((zone) => (
          <Card key={zone.title}>
            <CardHeader>
              <CardTitle className="text-base">{zone.title}</CardTitle>
              <CardDescription>{zone.description}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>
    </section>
  );
}
