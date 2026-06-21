import "server-only";

import { getServerEnv } from "@/config/server-env";
import type { AuthProviderKind, AuthScenario } from "@/types/auth";

/**
 * server-only の認証設定を環境変数から解決する。
 *
 * @returns provider 種別と mock scenario。
 * @throws AUTH_PROVIDER または MOCK_AUTH_SCENARIO が許可値ではない場合。
 */
export function getAuthConfig(): {
  provider: AuthProviderKind;
  mockScenario: AuthScenario;
} {
  const env = getServerEnv();

  return {
    provider: env.AUTH_PROVIDER,
    mockScenario: env.MOCK_AUTH_SCENARIO,
  };
}
