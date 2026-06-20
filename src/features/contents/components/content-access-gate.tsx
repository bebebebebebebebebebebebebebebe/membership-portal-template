import Link from "next/link";

import type { Content } from "@/features/contents/types/content";
import type { ContentPreview } from "@/features/contents/types/content-preview";
import type { ContentAccessDecision } from "@/features/contents/utils/content-access";
import { ContentPurchaseCta } from "@/features/contents/components/content-purchase-cta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/** 閲覧不可（denied）の理由。`canViewContent()` の decision から渡される。 */
export type DeniedReason = Extract<
  ContentAccessDecision,
  { allowed: false }
>["reason"];

export type ContentAccessGateProps = {
  content: Content;
  preview?: ContentPreview;
  reason: DeniedReason;
};

/**
 * denied 理由ごとの見出し・説明文。
 *
 * if 文を component 本体に散らさず、文言を 1 箇所に集約して網羅性を型で担保する。
 * CTA だけは reason ごとにリンク先・部品が異なるため別途出し分ける。
 */
const deniedCopy: Record<DeniedReason, { heading: string; description: string }> =
  {
    loginRequired: {
      heading: "ログインが必要です",
      description: "このコンテンツはログインすると閲覧できます。",
    },
    planRequired: {
      heading: "対象プランへの加入が必要です",
      description: "対象の有料プランに加入すると閲覧できます。",
    },
    purchaseRequired: {
      heading: "単品購入で閲覧できます",
      description: "このコンテンツは単品購入すると閲覧できます。",
    },
    planOrPurchaseRequired: {
      heading: "プラン加入または単品購入で閲覧できます",
      description: "対象プランへの加入、または単品購入のいずれかで閲覧できます。",
    },
  };

/**
 * denied 理由と閲覧条件から CTA 群を組み立てる。
 *
 * purchase を含む理由では価格解決を伴う `ContentPurchaseCta` を使い、plan を含む理由では
 * プラン確認導線（/pricing）を出す。`planOrPurchaseRequired` は購入とプランの両導線を並べる。
 * login が必要な理由では /login へ誘導する。価格・productId は accessPolicy から narrowing する。
 */
async function GateActions({
  reason,
  policy,
}: {
  reason: DeniedReason;
  policy: Content["accessPolicy"];
}) {
  switch (reason) {
    case "loginRequired":
      return (
        <Button asChild>
          <Link href="/login">ログインして見る</Link>
        </Button>
      );

    case "planRequired":
      return (
        <Button asChild>
          <Link href="/pricing">プランを確認</Link>
        </Button>
      );

    case "purchaseRequired":
      return policy.kind === "purchaseRequired"
        ? ContentPurchaseCta({ policy })
        : null;

    case "planOrPurchaseRequired":
      if (policy.kind !== "planOrPurchase") {
        return null;
      }

      return (
        <>
          {await ContentPurchaseCta({ policy })}
          <Button asChild variant="outline">
            <Link href="/pricing">プランを確認</Link>
          </Button>
        </>
      );
  }
}

/**
 * 閲覧不可コンテンツの本文の代わりに表示する Content Gate（Server Component）。
 *
 * 認可前に取得してよい metadata（title / description）と preview の概要だけを使い、
 * full body は一切受け取らない。denied 理由に応じた説明と CTA を提示し、ログイン・プラン・
 * 購入のいずれかへ誘導する。preview は存在するときだけ概要セクションを描画する。
 *
 * @param props - 対象コンテンツのメタデータ、認可前 preview、denied 理由。
 */
export async function ContentAccessGate(props: ContentAccessGateProps) {
  const { content, preview, reason } = props;
  const copy = deniedCopy[reason];
  const actions = await GateActions({ reason, policy: content.accessPolicy });

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <Badge variant="secondary" className="w-fit rounded-md px-2 py-0.5">
          閲覧制限
        </Badge>
        <CardTitle className="text-lg">{content.title}</CardTitle>
        <CardDescription>{content.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="rounded-xl border bg-muted/40 p-4">
          <p className="font-semibold text-foreground">{copy.heading}</p>
          <p className="text-muted-foreground">{copy.description}</p>
        </div>

        {preview?.introduction ? (
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">プレビュー</h2>
            <p className="text-muted-foreground">{preview.introduction}</p>
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        {actions}
      </CardFooter>
    </Card>
  );
}
