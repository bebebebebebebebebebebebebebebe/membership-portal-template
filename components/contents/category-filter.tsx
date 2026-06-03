"use client";

import { Bookmark02Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { contentCategories, resultCount } from "@/lib/mock/contents";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";

/**
 * 種別タブ・キーワード検索・絞り込み Select・件数表示をまとめたフィルタ領域。
 *
 * 認証/DB 未確定のため実フィルタリングは行わず、見た目と基本操作のみのモック。
 * デザインの 2 行構成（行1=検索/タブ/トグル、行2=タグ/更新日/並び順/件数）を再現する。
 */
export function CategoryFilter() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <InputGroup className="h-9 w-full lg:max-w-xs">
          <InputGroupAddon>
            <HugeiconsIcon icon={Search01Icon} />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            placeholder="キーワードで検索"
            aria-label="キーワードで検索"
          />
        </InputGroup>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              すべて
            </TabsTrigger>
            {contentCategories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Toggle variant="outline" aria-label="ブックマーク済みのみ表示">
          <HugeiconsIcon icon={Bookmark02Icon} />
          ブックマーク済みのみ
        </Toggle>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <span className="mr-1 text-muted-foreground">タグ</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="ai">AI活用</SelectItem>
                <SelectItem value="design">設計</SelectItem>
                <SelectItem value="security">セキュリティ</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-[160px]">
              <span className="mr-1 text-muted-foreground">更新日</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="week">今週</SelectItem>
                <SelectItem value="month">今月</SelectItem>
                <SelectItem value="year">今年</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select defaultValue="popular">
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="popular">人気順</SelectItem>
                <SelectItem value="newest">新着順</SelectItem>
                <SelectItem value="views">閲覧数順</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <span className="text-sm text-muted-foreground tabular-nums">
          検索結果 {resultCount}件
        </span>
      </div>
    </div>
  );
}
