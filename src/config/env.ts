import { z } from "zod";

type ServerEnvSource = Partial<{
  AUTH_PROVIDER: string;
  MOCK_AUTH_SCENARIO: string;
}>;

type PublicEnvSource = Partial<{
  NEXT_PUBLIC_API_MOCKING: string;
  NEXT_PUBLIC_BROWSER_AUTH_SCENARIO: string;
}>;

/**
 * 認証 provider の許可値 schema。
 *
 * server / proxy で共有し、未定義値は各 env object schema 側で default を適用する。
 */
export const authProviderSchema = z.enum(["mock", "real", "test"]);

/**
 * mock auth scenario の許可値 schema。
 *
 * role だけではなく membership / purchasedProductIds を含む viewer 状態のプリセットを表す。
 */
export const authScenarioSchema = z.enum([
  "anonymous",
  "free-member",
  "standard-member",
  "premium-member",
  "admin",
  "purchased-member",
]);

/**
 * browser MSW 有効化フラグの許可値 schema。
 */
export const apiMockingSchema = z.enum(["enabled", "disabled"]);

/**
 * server / proxy で使う private env schema。
 */
export const serverEnvSchema = z.object({
  AUTH_PROVIDER: authProviderSchema.default("mock"),
  MOCK_AUTH_SCENARIO: authScenarioSchema.default("premium-member"),
});

/**
 * browser bundle に公開してよい public env schema。
 */
export const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_MOCKING: apiMockingSchema.default("disabled"),
  NEXT_PUBLIC_BROWSER_AUTH_SCENARIO:
    authScenarioSchema.default("premium-member"),
});

/** server / proxy で検証済みの private env。 */
export type ServerEnv = z.infer<typeof serverEnvSchema>;

/** browser bundle に公開してよい検証済み public env。 */
export type PublicEnv = z.infer<typeof publicEnvSchema>;

/** env contract 上の認証 provider 種別。 */
export type AuthProviderFromEnv = z.infer<typeof authProviderSchema>;

/** env contract 上の mock auth scenario。 */
export type AuthScenarioFromEnv = z.infer<typeof authScenarioSchema>;

/**
 * server / proxy 用 env source を検証し、default 適用済み env を返す。
 *
 * @param source - `process.env` などの env source。
 * @returns 検証済みの private env。
 * @throws 許可されていない env 値が含まれる場合。
 */
export function parseServerEnv(source: ServerEnvSource): ServerEnv {
  return serverEnvSchema.parse({
    AUTH_PROVIDER: source.AUTH_PROVIDER,
    MOCK_AUTH_SCENARIO: source.MOCK_AUTH_SCENARIO,
  });
}

/**
 * public env source を検証し、default 適用済み env を返す。
 *
 * @param source - `NEXT_PUBLIC_` 付き env だけを含む env source。
 * @returns 検証済みの public env。
 * @throws 許可されていない env 値が含まれる場合。
 */
export function parsePublicEnv(source: PublicEnvSource): PublicEnv {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_API_MOCKING: source.NEXT_PUBLIC_API_MOCKING,
    NEXT_PUBLIC_BROWSER_AUTH_SCENARIO:
      source.NEXT_PUBLIC_BROWSER_AUTH_SCENARIO,
  });
}
