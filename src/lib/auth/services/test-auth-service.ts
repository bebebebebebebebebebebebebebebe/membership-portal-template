import "server-only";

import type { AuthService } from "@/lib/auth/auth-service";
import { getTestAuthState } from "@/lib/auth/testing/test-auth-state";

/**
 * Vitest から明示設定された AuthState を返す test auth service。
 */
export const testAuthService: AuthService = {
  async getAuthState() {
    return getTestAuthState();
  },
};
