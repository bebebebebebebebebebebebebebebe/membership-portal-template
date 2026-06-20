import {
  ArrowReloadHorizontalIcon,
  Megaphone01Icon,
  MagicWand01Icon,
  SearchAreaIcon,
  SparklesIcon,
  Target02Icon,
  TestTube01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";

import type { ArticleStep } from "@/features/contents/types/content-detail";

/** 各ステップに対応する装飾アイコン（最大 6 ノード）。 */
const stepIcons: IconSvgElement[] = [
  Target02Icon,
  SearchAreaIcon,
  TestTube01Icon,
  MagicWand01Icon,
  Megaphone01Icon,
  ArrowReloadHorizontalIcon,
];

/** ノードを円環状に等間隔配置するための座標（半径 39%・上端始点で時計回り）。 */
const NODE_RADIUS = 39;

function nodePosition(index: number, total: number) {
  const angle = (-90 + (360 / total) * index) * (Math.PI / 180);
  return {
    left: `${50 + NODE_RADIUS * Math.cos(angle)}%`,
    top: `${50 + NODE_RADIUS * Math.sin(angle)}%`,
  };
}

export type StepCycleDiagramProps = {
  steps: ArticleStep[];
  centerLabel: string;
};

/**
 * 「6つのステップ」を円環状のサイクルとして可視化する図。
 *
 * 各ステップをアイコン付きノードとして円周上に等間隔配置し、中央にサイクル名を置く。
 * 背景の点線円が循環（継続的な改善）を示す。デザイン原稿の配置を近似再現する装飾要素。
 *
 * @param props - 円環に並べるステップと、中央に表示するサイクル名。
 */
export function StepCycleDiagram(props: StepCycleDiagramProps) {
  const { steps, centerLabel } = props;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-xs">
      {/* 背景の循環を示す点線円 */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full text-primary/30"
        aria-hidden
      >
        <circle
          cx="50"
          cy="50"
          r={NODE_RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeDasharray="2 2.5"
        />
      </svg>

      {/* 中央のサイクル名 */}
      <div className="absolute left-1/2 top-1/2 flex size-[42%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full bg-accent text-center">
        <HugeiconsIcon icon={SparklesIcon} className="size-5 text-primary" />
        <span className="px-2 text-xs font-medium leading-tight text-accent-foreground">
          {centerLabel}
        </span>
      </div>

      {/* 円周上のステップノード */}
      {steps.map((step, index) => (
        <div
          key={step.title}
          className="absolute flex w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center"
          style={nodePosition(index, steps.length)}
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <HugeiconsIcon
              icon={stepIcons[index % stepIcons.length]}
              className="size-4"
            />
          </span>
          <span className="text-[11px] font-medium leading-tight text-foreground">
            {step.title}
          </span>
        </div>
      ))}
    </div>
  );
}
