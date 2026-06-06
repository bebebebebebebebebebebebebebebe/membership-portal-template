"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Logout01Icon,
  Notification03Icon,
  Search01Icon,
  Settings01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { getMemberNavTitle } from "../_config/member-nav";
import { currentUser } from "@/lib/mock/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

/**
 * Member Zone 共通の上部ヘッダー。
 *
 * パンくず・検索バー・通知・会員メニューで構成する。
 * 現在ページ名は現在パス（usePathname）からナビ定義を引いて決定するため、
 * Member Zone のどのページに置いても追加の props なしで動作する。
 */
export function SiteHeader() {
  const pathname = usePathname();
  const title = getMemberNavTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />

      <Breadcrumb className="hidden md:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Member Zone</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mx-auto flex w-full max-w-md flex-1 justify-center">
        <InputGroup className="h-9">
          <InputGroupInput
            type="search"
            placeholder="サイト内を検索..."
            aria-label="サイト内を検索"
          />
          <InputGroupAddon align="inline-end">
            <HugeiconsIcon icon={Search01Icon} />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="通知"
        >
          <HugeiconsIcon icon={Notification03Icon} />
          <Badge className="absolute -right-1 -top-1 size-4 justify-center rounded-full p-0 text-[10px] tabular-nums">
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto gap-2 px-2 py-1">
              <Avatar className="size-8">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.initials}</AvatarFallback>
              </Avatar>
              <span className="hidden flex-col items-start leading-tight sm:flex">
                <span className="text-sm font-medium">{currentUser.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {currentUser.membership}
                </span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col leading-tight">
                <span className="font-medium">{currentUser.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {currentUser.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/settings/profile">
                  <HugeiconsIcon icon={UserCircleIcon} />
                  プロフィール設定
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings/account">
                  <HugeiconsIcon icon={Settings01Icon} />
                  アカウント設定
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login">
                <HugeiconsIcon icon={Logout01Icon} />
                ログアウト
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
