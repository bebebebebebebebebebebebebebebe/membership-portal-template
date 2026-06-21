"use client";

import Link from "next/link";

import type { AuthUser } from "@/types/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * 認証済みユーザーの表示メニューに渡す props。
 *
 * Server Component 側で解決済みの plain な AuthUser だけを受け取り、
 * client hook や auth provider には依存しない。
 */
export type UserMenuButtonProps = {
  user: AuthUser;
};

/**
 * 認証済みユーザー向けの共通ユーザーメニューボタン。
 *
 * Public Zone と将来の共通 shell から再利用できる client component として、
 * 表示済みユーザー情報と主要な会員導線だけを扱う。logout は実認証実装が入るまで表示しない。
 *
 * @param props - 表示対象の認証済みユーザー。
 */
export function UserMenuButton({ user }: UserMenuButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto cursor-pointer gap-2 px-2 py-1"
          aria-label={`${user.name} のメニュー`}
        >
          <Avatar className="size-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
          <span className="hidden flex-col items-start leading-tight sm:flex">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {user.membership}
            </span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col leading-tight">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">ダッシュボード</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/bookmarks">ブックマーク</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings/profile">プロフィール設定</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {user.role === "admin" ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/admin/contents">コンテンツ管理</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
