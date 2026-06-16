import { AuthProvider } from "@/components/providers/auth-provider";
import { requireCurrentUserForRoute } from "@/lib/auth/authorization";

import { SiteHeader } from "./site-header";

/**
 * Member Zone のユーザー依存部を request time に解決する slot。
 *
 * 認証 guard（`requireCurrentUserForRoute`）・`AuthProvider`・user 依存ヘッダー・本文を
 * layout の static shell から切り離し、`<Suspense>` 内で stream する。Proxy の早期 redirect を
 * 通過しても、ここで最終的に認証を再確認する。
 *
 * @param nextPath 未ログイン時の login redirect 後に戻すパス。
 * @param children Member Zone の各ページ本文。
 */
export async function MemberAuthSlot({
  nextPath,
  children,
}: {
  nextPath: string;
  children: React.ReactNode;
}) {
  const user = await requireCurrentUserForRoute({ nextPath });

  return (
    <AuthProvider initialUser={user}>
      <SiteHeader user={user} />
      <main className="flex flex-1 flex-col gap-6 bg-muted/40 p-4 md:p-6">
        {children}
      </main>
    </AuthProvider>
  );
}
