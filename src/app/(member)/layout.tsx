import { Suspense } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AppSidebar } from "./_components/app-sidebar";
import { MemberAuthSlot } from "./_components/member-auth-slot";
import { MemberHeaderFallback } from "./_components/member-header-fallback";

/**
 * Member Zone（ログイン必須ゾーン）共通レイアウト。
 *
 * 左サイドバー（AppSidebar）とシェル枠は static shell として prerender し、ユーザー依存部
 * （認証 guard・ヘッダー・本文）は `<Suspense>` 内の `MemberAuthSlot` で request time に stream する。
 * これにより layout 全体の dynamic 化を避けつつ、認証解決前は fallback ヘッダーを表示する。
 * TooltipProvider はサイドバーの折りたたみ時ツールチップに必要。
 */
export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Suspense fallback={<MemberHeaderFallback />}>
            <MemberAuthSlot nextPath="/dashboard">{children}</MemberAuthSlot>
          </Suspense>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
