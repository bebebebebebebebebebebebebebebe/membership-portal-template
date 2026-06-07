import type { AuthUser } from "@/types/auth";
import { mockCurrentUser } from "@/lib/mock/auth-user";

/**
 * 現在の認証ユーザーを取得する provider 非依存の入口。
 *
 * 認証基盤が未確定のため現時点ではモックを返し、将来は NextAuth.js / Supabase Auth / Clerk などの
 * session 取得実装へこの関数内で差し替える。
 *
 * @returns 認証済みユーザー。未ログイン時は `null`
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  return mockCurrentUser;
}
