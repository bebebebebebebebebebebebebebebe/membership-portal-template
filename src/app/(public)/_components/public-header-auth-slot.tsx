import Link from "next/link";

import { UserMenuButton } from "@/components/auth/user-menu-button";
import { Button } from "@/components/ui/button";
import { getCurrentAuthState } from "@/lib/auth/get-current-auth-state";

/**
 * Public Zone header の右端に表示する認証状態別 slot。
 *
 * Server-side auth state を解決し、未ログインならログイン／新規登録導線、
 * 認証済みなら plain な AuthUser を UserMenuButton に渡す。layout 本体では await せず、
 * Suspense 境界内でのみ request-time の認証状態を扱う。
 *
 * @returns 認証状態に応じた header 右端の UI。
 */
export async function PublicHeaderAuthSlot(): Promise<React.JSX.Element> {
  const { user } = await getCurrentAuthState();

  if (user !== null) {
    return <UserMenuButton user={user} />;
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link href="/login">ログイン</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/register">新規登録</Link>
      </Button>
    </div>
  );
}
