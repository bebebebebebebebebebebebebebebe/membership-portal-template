import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createLoginRedirectPath } from "@/lib/auth/auth-redirect";
import { isAuthenticatedByProxy } from "@/lib/auth/proxy-auth";
import { isMemberProtectedRoute } from "@/lib/auth/protected-routes";

/**
 * Member Zone への未ログインアクセスを login route へ早期 redirect する。
 *
 * Proxy では軽量な optimistic check だけを行い、最終的な認可判断は Server Component
 * や data source 近くの guard に委ねる。
 *
 * @param request - Next.js Proxy request。
 * @returns redirect または通常継続の response。
 */
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isMemberProtectedRoute(pathname) && !isAuthenticatedByProxy(request)) {
    return NextResponse.redirect(
      new URL(createLoginRedirectPath(pathname), request.nextUrl)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map)$).*)",
  ],
};
