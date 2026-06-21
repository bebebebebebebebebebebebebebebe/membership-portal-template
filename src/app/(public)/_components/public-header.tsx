import { Suspense } from "react";
import Link from "next/link";
import { Notification03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { PublicHeaderAuthSlot } from "./public-header-auth-slot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Public Zone 共通の上部ヘッダー。
 *
 * ロゴと通知導線は静的 shell として返し、認証状態に依存する右端 slot だけを
 * Suspense 境界に閉じ込める。fallback は固定幅にして認証解決時の header 横揺れを抑える。
 */
export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="font-bold tracking-tight">
          Modular Member Portal
        </Link>

        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative cursor-pointer"
            aria-label="通知"
          >
            <HugeiconsIcon icon={Notification03Icon} />
            <Badge className="absolute -right-1 -top-1 size-4 justify-center rounded-full p-0 text-[10px] tabular-nums">
              3
            </Badge>
          </Button>
          <Suspense
            fallback={
              <Skeleton
                className="h-8 w-36 sm:w-44"
                aria-label="認証状態を読み込み中"
              />
            }
          >
            <PublicHeaderAuthSlot />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
