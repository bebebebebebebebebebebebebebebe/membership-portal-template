import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { UserMenuButton } from "@/components/auth/user-menu-button";
import type { AuthUser } from "@/types/auth";

const memberUser: AuthUser = {
  name: "一般 会員",
  email: "member@example.com",
  avatar: "/images/avatars/avatar-01.jpg",
  initials: "一般",
  membership: "無料会員",
  role: "member",
};

const adminUser: AuthUser = {
  name: "管理者 太郎",
  email: "admin@example.com",
  avatar: "/images/avatars/avatar-02.jpg",
  initials: "管",
  membership: "管理者",
  role: "admin",
};

function openMenu(user: AuthUser = memberUser) {
  render(<UserMenuButton user={user} />);
  fireEvent.pointerDown(
    screen.getByRole("button", { name: `${user.name} のメニュー` }),
    { button: 0, ctrlKey: false }
  );
}

describe("UserMenuButton", () => {
  it("user initials / name を表示する", () => {
    render(<UserMenuButton user={memberUser} />);

    expect(screen.getByText("一般")).toBeInTheDocument();
    expect(screen.getByText("一般 会員")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "一般 会員 のメニュー" })
    ).toHaveClass("cursor-pointer");
  });

  it("menu open 後に dashboard / bookmarks / profile links を表示する", () => {
    openMenu();

    expect(screen.getByText("ダッシュボード").closest("a")).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(screen.getByText("ブックマーク").closest("a")).toHaveAttribute(
      "href",
      "/bookmarks"
    );
    expect(screen.getByText("プロフィール設定").closest("a")).toHaveAttribute(
      "href",
      "/settings/profile"
    );
  });

  it("admin user の場合だけ admin link を表示する", () => {
    openMenu();
    expect(screen.queryByText("コンテンツ管理")).not.toBeInTheDocument();

    openMenu(adminUser);
    expect(screen.getByText("コンテンツ管理").closest("a")).toHaveAttribute(
      "href",
      "/admin/contents"
    );
  });
});
