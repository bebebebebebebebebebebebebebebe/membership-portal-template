import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarTrigger } from "@/components/ui/sidebar";

/**
 * Member Zone ヘッダーの static shell fallback。
 *
 * `MemberAuthSlot` が request time に user を解決するまで表示する。空 fallback にせず、
 * 実ヘッダー（`h-16` + 下線）と同じ高さ・枠を保ち、認証解決後のレイアウトずれを防ぐ。
 */
export function MemberHeaderFallback() {
  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-6" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="ml-auto size-8 rounded-full" />
      </header>
      <main className="flex flex-1 flex-col gap-6 bg-muted/40 p-4 md:p-6" />
    </>
  );
}
