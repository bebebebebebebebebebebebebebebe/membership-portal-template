import type { AuthUser } from "@/types/auth";
import { getCurrentAuthState } from "@/lib/auth/get-current-auth-state";

/**
 * 現在の認証ユーザーを取得する provider 非依存の入口。
 *
 * 認証状態の解決は Auth Service に委譲し、この関数は既存呼び出し側向けに
 * user DTO だけを返す互換入口として維持する。
 *
 * @returns 認証済みユーザー。未ログイン時は `null`
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  return (await getCurrentAuthState()).user;
}
