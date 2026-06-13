import type { AuthState } from "@/types/auth";

/**
 * 認証 provider 実装を差し替えるための server-side service contract。
 *
 * @returns 現在 request の認証ユーザーと購入済み productId を含む状態。
 */
export type AuthService = {
  getAuthState(): Promise<AuthState>;
};
