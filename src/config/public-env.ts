import { parsePublicEnv, type PublicEnv } from "@/config/env";

/**
 * browser bundle に公開してよい env だけを読み取り、検証済み env を返す。
 *
 * `NEXT_PUBLIC_` 付きの値は Next.js build 時に inline されるため、ここでは各 env key を
 * 明示的に参照する。
 *
 * @returns default 適用済みの public env。
 * @throws public env に許可されていない値が含まれる場合。
 */
export function getPublicEnv(): PublicEnv {
  return parsePublicEnv({
    NEXT_PUBLIC_API_MOCKING: process.env.NEXT_PUBLIC_API_MOCKING,
    NEXT_PUBLIC_BROWSER_AUTH_SCENARIO:
      process.env.NEXT_PUBLIC_BROWSER_AUTH_SCENARIO,
  });
}
