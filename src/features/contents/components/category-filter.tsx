"use client";

import { Bookmark02Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { contentCategories } from "@/features/contents/constants/content-category";
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

const resultCount = 24;

/**
 * 種別タブ・キーワード検索・絞り込み Select・件数表示をまとめたフィルタ領域。
 *
 * 認証/DB 未確定のため実フィルタリングは行わず、見た目と基本操作のみのモック。
 * 左に検索とカテゴリ、右に詳細フィルターとブックマーク切替を置く。
 */
export function CategoryFilter() {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(320px,1fr)_auto] items-center">
        <div
          className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center"
          data-filter-region="primary"
        >
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
            <TabsList className="w-full sm:w-auto">
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
        </div>

        <div
          className="flex flex-wrap items-center justify-start gap-3 lg:justify-end"
          data-filter-region="refinements"
        >
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

          <Toggle variant="outline" aria-label="ブックマーク済みのみ表示">
            <HugeiconsIcon icon={Bookmark02Icon} />
            ブックマーク済みのみ
          </Toggle>

          <span className="text-sm text-muted-foreground tabular-nums">
            検索結果 {resultCount}件
          </span>
        </div>
      </div>
    </div>
  );
}
