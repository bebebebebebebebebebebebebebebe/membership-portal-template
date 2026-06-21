import "server-only";

import { parseServerEnv, type ServerEnv } from "@/config/env";

/**
 * server-only runtime から private env を読み取り、検証済み env を返す。
 *
 * @returns default 適用済みの private env。
 * @throws private env に許可されていない値が含まれる場合。
 */
export function getServerEnv(): ServerEnv {
  return parseServerEnv({
    AUTH_PROVIDER: process.env.AUTH_PROVIDER,
    MOCK_AUTH_SCENARIO: process.env.MOCK_AUTH_SCENARIO,
  });
}
