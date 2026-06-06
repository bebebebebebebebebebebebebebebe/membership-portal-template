import {
  Bookmark02Icon,
  DashboardSquare01Icon,
  GridViewIcon,
  Notification03Icon,
  Settings01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

/**
 * Member Zone のサイドバーナビゲーション項目。
 *
 * 将来の Member Zone 全 7 ページ追加に備え、ナビ定義はこの 1 ファイルに集約する。
 * `icon` は hugeicons の IconSvgElement（データ配列）をそのまま保持し、
 * 文字列キー経由ではなくオブジェクトとして `HugeiconsIcon` に渡す。
 */
export type MemberNavItem = {
  /** メニューに表示するラベル */
  title: string;
  /** 遷移先パス。現在パスとの一致でアクティブ状態を判定する */
  href: string;
  /** 項目アイコン（hugeicons の IconSvgElement） */
  icon: IconSvgElement;
  /** 詳細ページなどで同じ項目を active にする pathname prefix */
  activePathPrefixes?: string[];
};

/** ラベル付きのナビゲーショングループ（デザインの「メンバーゾーン」「設定」見出しに対応）。 */
export type MemberNavGroup = {
  label: string;
  items: MemberNavItem[];
};

export const memberNavGroups: MemberNavGroup[] = [
  {
    label: "メンバーゾーン",
    items: [
      { title: "ダッシュボード", href: "/dashboard", icon: DashboardSquare01Icon },
      {
        title: "コンテンツ一覧",
        href: "/contents",
        icon: GridViewIcon,
        activePathPrefixes: ["/contents"],
      },
      { title: "お気に入り", href: "/bookmarks", icon: Bookmark02Icon },
      { title: "通知", href: "/notifications", icon: Notification03Icon },
    ],
  },
  {
    label: "設定",
    items: [
      { title: "プロフィール設定", href: "/settings/profile", icon: UserCircleIcon },
      { title: "アカウント設定", href: "/settings/account", icon: Settings01Icon },
    ],
  },
];

/** 全グループを平坦化したナビ項目（現在パスからページ名を引く用途）。 */
export const memberNavItems: MemberNavItem[] = memberNavGroups.flatMap(
  (group) => group.items
);

const memberNavTitleByPath = new Map(
  memberNavItems.map((item) => [item.href, item.title])
);

/**
 * pathname がナビ項目の active 条件に一致するかを返す。
 *
 * @param pathname 現在の URL pathname
 * @param item 判定対象の Member Zone ナビ項目
 * @returns 完全一致、または segment 境界を保った prefix 一致なら true。
 */
export function isMemberNavItemActive(
  pathname: string,
  item: MemberNavItem
): boolean {
  if (pathname === item.href) {
    return true;
  }

  return (item.activePathPrefixes ?? []).some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/**
 * pathname に対応する Member Zone のページタイトルを返す。
 *
 * @param pathname 現在の URL pathname
 * @returns ナビ定義に一致するタイトル。一致しない場合は "Member Zone"。
 */
export function getMemberNavTitle(pathname: string): string {
  const exactTitle = memberNavTitleByPath.get(pathname);

  if (exactTitle) {
    return exactTitle;
  }

  return (
    memberNavItems.find((item) => isMemberNavItemActive(pathname, item))
      ?.title ?? "Member Zone"
  );
}
