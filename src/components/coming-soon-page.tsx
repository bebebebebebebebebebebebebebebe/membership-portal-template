import Link from "next/link";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

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

/**
 * 未実装 route の placeholder 表示に必要な文言と導線。
 */
export type ComingSoonPageProps = {
  /** 表示する zone や状態を示す短いラベル。 */
  eyebrow: string;
  /** ページの主見出し。 */
  title: string;
  /** route の将来役割を説明する本文。 */
  description: string;
  /** 実装予定の主要項目。 */
  plannedItems: string[];
  /** 主 CTA の遷移先。 */
  primaryHref: string;
  /** 主 CTA の表示ラベル。 */
  primaryLabel: string;
  /** 補助 CTA の遷移先。指定しない場合は補助 CTA を表示しない。 */
  secondaryHref?: string;
  /** 補助 CTA の表示ラベル。`secondaryHref` と揃っている場合だけ表示する。 */
  secondaryLabel?: string;
};

/**
 * 未実装 route に表示する共通 Coming Soon ページ。
 *
 * @param props route 固有の表示文言、実装予定項目、戻り先 CTA。
 * @returns shadcn/ui の Card と CTA で構成した placeholder UI。
 */
export function ComingSoonPage({
  eyebrow,
  title,
  description,
  plannedItems,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: ComingSoonPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 items-center py-8 md:py-12">
      <Card className="w-full">
        <CardHeader className="gap-3">
          <Badge variant="secondary" className="w-fit">
            {eyebrow}
          </Badge>
          <div className="flex flex-col gap-2">
            <CardTitle className="text-2xl md:text-3xl">{title}</CardTitle>
            <CardDescription className="text-base leading-7">
              {description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border bg-muted/40 p-4">
            <h2 className="text-sm font-semibold">実装予定の内容</h2>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground">
              {plannedItems.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href={primaryHref}>
              {primaryLabel}
              <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
            </Link>
          </Button>

          {secondaryHref && secondaryLabel ? (
            <Button asChild variant="outline">
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}
