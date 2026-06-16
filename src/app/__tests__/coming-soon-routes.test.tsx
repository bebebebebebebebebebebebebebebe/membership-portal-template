import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AdminContentsPage from "@/app/admin/contents/page";
import DashboardPage from "@/app/(member)/dashboard/page";
import ForbiddenPage from "@/app/(public)/forbidden/page";
import { LoginNextNotice } from "@/app/(public)/login/_components/login-next-notice";
import LoginPage from "@/app/(public)/login/page";
import RegisterPage from "@/app/(public)/register/page";

describe("Coming Soon route pages", () => {
  it("/login は searchParams を await せず Public Zone の Coming Soon と新規登録導線を表示する", () => {
    // page 本体は同期 component。next の案内は Suspense 内 slot に隔離されている。
    render(LoginPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByText("Public Zone")).toBeInTheDocument();
    expect(screen.getByText("ログイン機能は準備中です")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "新規登録へ" })).toHaveAttribute(
      "href",
      "/register"
    );
  });

  it("LoginNextNotice は安全化した next path を案内文言に反映する", async () => {
    render(
      await LoginNextNotice({
        searchParams: Promise.resolve({ next: "/bookmarks" }),
      })
    );

    expect(
      screen.getByText("ログイン完了後は /bookmarks に戻れます。")
    ).toBeInTheDocument();
  });

  it("/register は Public Zone の Coming Soon とログイン導線を表示する", () => {
    render(<RegisterPage />);

    expect(screen.getByText("Public Zone")).toBeInTheDocument();
    expect(screen.getByText("新規登録機能は準備中です")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ログインへ" })).toHaveAttribute(
      "href",
      "/login"
    );
  });

  it("/dashboard は Member Zone の Coming Soon とコンテンツ導線を表示する", () => {
    render(<DashboardPage />);

    expect(screen.getByText("Member Zone")).toBeInTheDocument();
    expect(screen.getByText("ダッシュボードは準備中です")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /コンテンツカタログを見る/ })
    ).toHaveAttribute("href", "/contents");
  });

  it("/admin/contents は Admin Zone の Coming Soon と管理予定項目を表示する", () => {
    render(<AdminContentsPage />);

    expect(screen.getByText("Admin Zone")).toBeInTheDocument();
    expect(screen.getByText("Admin コンテンツ管理は準備中です")).toBeInTheDocument();
    expect(screen.getByText("コンテンツの作成・編集・削除")).toBeInTheDocument();
    expect(screen.queryByText("実装済み")).not.toBeInTheDocument();
  });

  it("/forbidden は権限不足の案内と復帰導線を表示する", () => {
    render(<ForbiddenPage />);

    expect(screen.getByText("アクセス権限がありません")).toBeInTheDocument();
    expect(
      screen.getByText("このページは管理者権限を持つユーザーのみ利用できます。")
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "コンテンツカタログへ" }))
      .toHaveAttribute("href", "/contents");
    expect(screen.getByRole("link", { name: "ダッシュボードへ" }))
      .toHaveAttribute("href", "/dashboard");
    expect(screen.queryByText("CRUD")).not.toBeInTheDocument();
  });
});
