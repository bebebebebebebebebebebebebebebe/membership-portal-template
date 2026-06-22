import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * MVP の主要機能を一覧するセクション。
 *
 * 実装済み・実装予定を問わず、ポータルが対象とする機能の広がりを示す。実装状態の正確な記録は
 * README に委ね、ここでは機能の概観にとどめる。
 */
const features: { title: string; description: string }[] = [
  {
    title: "コンテンツカタログ",
    description: "コンテンツを公開条件つきで一覧表示します。",
  },
  {
    title: "コンテンツ詳細",
    description: "閲覧条件に応じて本文または Content Gate を表示します。",
  },
  {
    title: "お気に入り",
    description: "保存したコンテンツをまとめて確認します。",
  },
  {
    title: "通知",
    description: "お知らせや更新情報を受け取ります。",
  },
  {
    title: "Admin コンテンツ管理",
    description: "投稿・編集・公開制御を RBAC 付きで行います。",
  },
];

export function MvpFeatureOverview() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">主要機能</h2>
        <p className="text-muted-foreground">
          会員制ポータルに必要な機能を段階的に追加できる骨格です。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle className="text-base">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>
    </section>
  );
}
