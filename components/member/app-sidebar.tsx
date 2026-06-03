"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CubeIcon, HelpCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { memberNavGroups } from "@/lib/member-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

/** アクティブ項目をソリッドなティール塗りにする上書きクラス（hover は従来のまま）。 */
const activeItemClass =
  "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90 data-[active=true]:hover:text-primary-foreground";

/**
 * Member Zone 共通の左サイドバー。
 *
 * ロゴ・グループ見出し付きナビゲーション・フッター（ヘルプ／著作権）で構成し、
 * 現在パスと一致するナビ項目をティール塗りでアクティブ表示する。
 * ユーザー情報はヘッダー側に集約するため、サイドバーには会員カードを置かない。
 */
export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <HugeiconsIcon icon={CubeIcon} />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold">Modular</span>
                  <span className="text-xs text-muted-foreground">
                    Member Portal
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {memberNavGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                      className={activeItemClass}
                    >
                      <Link href={item.href}>
                        <HugeiconsIcon icon={item.icon} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="ヘルプ・お問い合わせ">
              <Link href="/help">
                <HugeiconsIcon icon={HelpCircleIcon} />
                <span>ヘルプ・お問い合わせ</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <p className="px-2 py-1 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          © 2024 Modular Inc.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
