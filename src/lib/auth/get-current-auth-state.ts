import "server-only";

import { cache } from "react";

import { getAuthConfig } from "@/lib/auth/auth-config";
import type { AuthService } from "@/lib/auth/auth-service";
import { createMockAuthService } from "@/lib/auth/services/mock-auth-service";
import { realAuthService } from "@/lib/auth/services/real-auth-service";
import { testAuthService } from "@/lib/auth/services/test-auth-service";
import type { AuthState } from "@/types/auth";

function getAuthService(): AuthService {
  const config = getAuthConfig();

  switch (config.provider) {
    case "mock":
      return createMockAuthService(config.mockScenario);
    case "real":
      return realAuthService;
    case "test":
      return testAuthService;
  }
}

const getCachedAuthState = cache(async (): Promise<AuthState> => {
  return getAuthService().getAuthState();
});

/**
 * 現在 request の認証状態を server-side auth service から取得する。
 *
 * mock / real provider は render pass 内で memoize し、test provider は各 test が
 * mutable state を差し替えられるよう cache を迂回する。
 *
 * @returns 現在ユーザーと購入済み productId を含む AuthState。
 */
export async function getCurrentAuthState(): Promise<AuthState> {
  const config = getAuthConfig();

  if (config.provider === "test") {
    return testAuthService.getAuthState();
  }

  return getCachedAuthState();
}
