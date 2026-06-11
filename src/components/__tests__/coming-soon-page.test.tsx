import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ComingSoonPage } from "@/components/coming-soon-page";

describe("ComingSoonPage", () => {
  it("未実装 route の説明と実装予定項目を表示する", () => {
    render(
      <ComingSoonPage
        eyebrow="Public Zone"
        title="サンプル機能は準備中です"
        description="この route は今後の機能追加で利用します。"
        plannedItems={["主要フォームの追加", "認証基盤との接続"]}
        primaryHref="/contents"
        primaryLabel="コンテンツを見る"
      />
    );

    expect(screen.getByText("Public Zone")).toBeInTheDocument();
    expect(screen.getByText("サンプル機能は準備中です")).toBeInTheDocument();
    expect(
      screen.getByText("この route は今後の機能追加で利用します。")
    ).toBeInTheDocument();
    expect(screen.getByText("主要フォームの追加")).toBeInTheDocument();
    expect(screen.getByText("認証基盤との接続")).toBeInTheDocument();
  });

  it("主 CTA と任意の補助 CTA を Link として表示する", () => {
    render(
      <ComingSoonPage
        eyebrow="Public Zone"
        title="サンプル機能は準備中です"
        description="この route は今後の機能追加で利用します。"
        plannedItems={["主要フォームの追加"]}
        primaryHref="/contents"
        primaryLabel="コンテンツを見る"
        secondaryHref="/login"
        secondaryLabel="ログインへ"
      />
    );

    expect(screen.getByRole("link", { name: /コンテンツを見る/ })).toHaveAttribute(
      "href",
      "/contents"
    );
    expect(screen.getByRole("link", { name: "ログインへ" })).toHaveAttribute(
      "href",
      "/login"
    );
  });

  it("補助 CTA の props がない場合は補助 Link を表示しない", () => {
    render(
      <ComingSoonPage
        eyebrow="Member Zone"
        title="サンプル機能は準備中です"
        description="この route は今後の機能追加で利用します。"
        plannedItems={["主要フォームの追加"]}
        primaryHref="/contents"
        primaryLabel="コンテンツを見る"
      />
    );

    expect(screen.queryByRole("link", { name: "ログインへ" })).not.toBeInTheDocument();
  });
});
