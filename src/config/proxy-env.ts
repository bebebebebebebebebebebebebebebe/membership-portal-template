import { parseServerEnv, type ServerEnv } from "@/config/env";

/**
 * Proxy から安全に使える private env subset を読み取り、検証済み env を返す。
 *
 * `server-only` module は import せず、Proxy の early redirect 判定に必要な値だけを扱う。
 *
 * @returns default 適用済みの private env。
 * @throws private env に許可されていない値が含まれる場合。
 */
export function getProxyEnv(): ServerEnv {
  return parseServerEnv({
    AUTH_PROVIDER: process.env.AUTH_PROVIDER,
    MOCK_AUTH_SCENARIO: process.env.MOCK_AUTH_SCENARIO,
  });
}
