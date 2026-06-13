import "server-only";

import type { AuthProviderKind, AuthScenario } from "@/types/auth";

const authProviderKinds = ["mock", "real", "test"] as const;
const authScenarios = [
  "anonymous",
  "free-member",
  "standard-member",
  "premium-member",
  "admin",
  "purchased-member",
] as const;

function isAuthProviderKind(value: string): value is AuthProviderKind {
  return authProviderKinds.includes(value as AuthProviderKind);
}

function isAuthScenario(value: string): value is AuthScenario {
  return authScenarios.includes(value as AuthScenario);
}

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
  const provider = process.env.AUTH_PROVIDER ?? "mock";
  const mockScenario = process.env.MOCK_AUTH_SCENARIO ?? "premium-member";

  if (!isAuthProviderKind(provider)) {
    throw new Error(`Invalid AUTH_PROVIDER: ${provider}`);
  }

  if (!isAuthScenario(mockScenario)) {
    throw new Error(`Invalid MOCK_AUTH_SCENARIO: ${mockScenario}`);
  }

  return { provider, mockScenario };
}
