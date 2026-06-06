import { Idea01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { ContentDetail } from "@/features/contents/types/content-detail";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StepCycleDiagram } from "@/features/contents/components/detail/step-cycle-diagram";

/** 番号付きステップ 1 項目（左カラムのリスト）。 */
function StepListItem({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description: string;
}) {
  return (
    <li className="flex gap-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground tabular-nums">
        {index}
      </span>
      <p className="text-sm leading-relaxed">
        <span className="font-semibold text-foreground">{title}</span>
        <span className="text-muted-foreground">：{description}</span>
      </p>
    </li>
  );
}

/**
 * 記事本文。要点コールアウト → 本文セクション（任意でポイントコールアウト）→
 * 「{stepsHeading}」ブロック（番号付きリスト＋サイクル図）→ まとめ、の順に縦積みする。
 *
 * 各セクションには目次アンカー用の `id` を付与し、右レールの目次から遷移できるようにする。
 *
 * @param detail 記事詳細データ（本文・ステップ・まとめ・目次を含む）
 */
export function ArticleBody({ detail }: { detail: ContentDetail }) {
  const stepsHeading =
    detail.toc.find((item) => item.id === "steps")?.label ?? "ステップ";

  return (
    <div className="flex flex-col gap-8">
      {/* この記事の要点 */}
      <Alert className="gap-2 border-primary/20 bg-accent/50 px-4 py-3">
        <HugeiconsIcon icon={Idea01Icon} className="size-5 text-primary" />
        <AlertTitle className="text-sm font-semibold text-foreground">
          {detail.summary.title}
        </AlertTitle>
        <AlertDescription className="text-sm/relaxed text-muted-foreground">
          {detail.summary.body}
        </AlertDescription>
      </Alert>

      {/* 概要・導入のポイント等のセクション */}
      {detail.sections.map((section) => (
        <section key={section.id} id={section.id} className="flex flex-col gap-3 scroll-mt-20">
          <h2 className="text-xl font-bold tracking-tight">{section.heading}</h2>
          {section.paragraphs.map((paragraph, index) => (
            <p key={index} className="leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
          {section.callout && (
            <Alert className="gap-2 border-amber-200 bg-amber-50 px-4 py-3">
              <HugeiconsIcon icon={Idea01Icon} className="size-5 text-amber-500" />
              <AlertTitle className="text-sm font-semibold text-amber-900">
                {section.callout.title}
              </AlertTitle>
              <AlertDescription className="text-sm/relaxed text-amber-800">
                {section.callout.body}
              </AlertDescription>
            </Alert>
          )}
        </section>
      ))}

      {/* 6つのステップ + サイクル図 */}
      <section id="steps" className="flex flex-col gap-4 scroll-mt-20">
        <h2 className="text-xl font-bold tracking-tight">{stepsHeading}</h2>
        <div className="grid items-center gap-6 md:grid-cols-2">
          <ol className="flex flex-col gap-3">
            {detail.steps.map((step, index) => (
              <StepListItem
                key={step.title}
                index={index + 1}
                title={step.title}
                description={step.description}
              />
            ))}
          </ol>
          <StepCycleDiagram steps={detail.steps} centerLabel={detail.cycleLabel} />
        </div>
      </section>

      {/* まとめ */}
      <section id="conclusion" className="flex flex-col gap-3 scroll-mt-20">
        <h2 className="text-xl font-bold tracking-tight">まとめ</h2>
        <p className="leading-relaxed text-muted-foreground">{detail.conclusion}</p>
      </section>
    </div>
  );
}
