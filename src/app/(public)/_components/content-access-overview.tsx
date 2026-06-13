import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * コンテンツの閲覧条件（accessPolicy の 5 種別）を説明するセクション。
 *
 * 一覧カードや Content Gate で実際に使われる種別と表現を揃え、ポータルの課金・公開モデルを
 * 一望できるようにする。文言は accessPolicy の意味に対応させる。
 */
const accessKinds: { title: string; description: string }[] = [
  {
    title: "無料公開",
    description: "ログイン不要で誰でも全文を閲覧できます。",
  },
  {
    title: "ログイン限定",
    description: "アカウントにログインすると無料で閲覧できます。",
  },
  {
    title: "有料プラン",
    description: "対象の有料プランに加入したメンバーが閲覧できます。",
  },
  {
    title: "単品購入",
    description: "プランに依らず、コンテンツ単位の購入で閲覧できます。",
  },
  {
    title: "プランまたは購入",
    description: "対象プランへの加入、または単品購入のいずれかで閲覧できます。",
  },
];

export function ContentAccessOverview() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">閲覧条件</h2>
        <p className="text-muted-foreground">
          コンテンツごとに公開範囲を切り替えられます。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accessKinds.map((kind) => (
          <Card key={kind.title}>
            <CardHeader>
              <CardTitle className="text-base">{kind.title}</CardTitle>
              <CardDescription>{kind.description}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>
    </section>
  );
}
