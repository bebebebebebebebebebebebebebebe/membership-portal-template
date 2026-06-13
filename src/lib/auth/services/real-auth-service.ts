import "server-only";

import type { AuthService } from "@/lib/auth/auth-service";

/**
 * 将来の実認証 provider 接続口。
 *
 * @throws 実 provider が未接続の状態で `AUTH_PROVIDER=real` が指定された場合。
 */
export const realAuthService: AuthService = {
  async getAuthState() {
    throw new Error("realAuthService is not implemented yet.");
  },
};
