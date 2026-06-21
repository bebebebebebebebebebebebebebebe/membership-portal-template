import type { NextRequest } from "next/server";

import { getProxyEnv } from "@/config/proxy-env";

/**
 * Proxy で使う軽量な認証済み判定を行う。
 *
 * Proxy は早期 redirect のための optimistic check に限定し、server-only service、
 * DB、外部 API、Route Handler は呼ばない。最終的な認可は Server Component や
 * data source 近くの guard が担う。
 *
 * @param request - Proxy に渡された Next.js request。
 * @returns Proxy 時点で認証済みと見なせる場合は `true`。
 */
export function isAuthenticatedByProxy(request: NextRequest): boolean {
  const env = getProxyEnv();

  if (env.AUTH_PROVIDER === "mock") {
    return env.MOCK_AUTH_SCENARIO !== "anonymous";
  }

  if (env.AUTH_PROVIDER === "test") {
    return request.cookies.get("__test_auth")?.value === "authenticated";
  }

  if (env.AUTH_PROVIDER === "real") {
    return Boolean(request.cookies.get("session")?.value);
  }

  return false;
}
