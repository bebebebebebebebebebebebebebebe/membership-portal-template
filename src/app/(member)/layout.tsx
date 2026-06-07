import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { requireAuthenticatedUser } from "@/lib/auth/authorization";

import { AppSidebar } from "./_components/app-sidebar";
import { SiteHeader } from "./_components/site-header";

/**
 * Member Zone（ログイン必須ゾーン）共通レイアウト。
 *
 * 左サイドバー（AppSidebar）と上部ヘッダー（SiteHeader）を全ページで共有し、
 * 本文は薄いグレー背景のメイン領域に流し込む。将来の Member Zone 全 7 ページが
 * このシェルを再利用する。TooltipProvider はサイドバーの折りたたみ時ツールチップに必要。
 */
export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = requireAuthenticatedUser(await getCurrentUser());

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader user={user} />
          <main className="flex flex-1 flex-col gap-6 bg-muted/40 p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
