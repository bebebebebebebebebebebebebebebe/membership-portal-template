import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import PublicLayout from "@/app/(public)/layout";
import { PublicHeader } from "@/app/(public)/_components/public-header";
import { PublicHeaderAuthSlot } from "@/app/(public)/_components/public-header-auth-slot";
import { setTestAuthState } from "@/lib/auth/testing/test-auth-state";
import type { AuthUser } from "@/types/auth";

const memberUser: AuthUser = {
  name: "一般 会員",
  email: "member@example.com",
  avatar: "/images/avatars/avatar-01.jpg",
  initials: "一般",
  membership: "無料会員",
  role: "member",
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("PublicLayout", () => {
  it("layout 自体は auth を await せず static shell を返す", () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: null, purchasedProductIds: [] });

    expect(
      PublicLayout({ children: <div>Public content</div> })
    ).toBeDefined();
  });
});

describe("PublicHeader", () => {
  it("コンテンツ button の位置には遷移しない通知 icon button と badge を表示する", () => {
    render(<PublicHeader />);

    const notificationButton = screen.getByRole("button", { name: "通知" });

    expect(notificationButton).toHaveClass("relative");
    expect(notificationButton).toHaveClass("cursor-pointer");
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "通知" })).toBeNull();
    expect(screen.queryByRole("link", { name: "コンテンツ" })).toBeNull();
  });

  it("user menu slot の fallback は固定幅 skeleton を返す", () => {
    render(<PublicHeader />);

    expect(screen.getByLabelText("認証状態を読み込み中")).toHaveClass(
      "h-8",
      "w-36",
      "sm:w-44"
    );
  });
});

describe("PublicHeaderAuthSlot", () => {
  it("未ログイン user には login / register 導線を返す", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: null, purchasedProductIds: [] });

    render(await PublicHeaderAuthSlot());

    expect(screen.getByRole("link", { name: "ログイン" })).toHaveAttribute(
      "href",
      "/login"
    );
    expect(screen.getByRole("link", { name: "新規登録" })).toHaveAttribute(
      "href",
      "/register"
    );
  });

  it("認証済み user には user menu button を返す", async () => {
    vi.stubEnv("AUTH_PROVIDER", "test");
    setTestAuthState({ user: memberUser, purchasedProductIds: [] });

    render(await PublicHeaderAuthSlot());

    expect(
      screen.getByRole("button", { name: "一般 会員 のメニュー" })
    ).toHaveClass(
      "cursor-pointer"
    );
  });
});
