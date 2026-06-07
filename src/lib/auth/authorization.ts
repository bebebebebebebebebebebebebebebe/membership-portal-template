import type { AuthUser, UserRole } from "@/types/auth";

/**
 * 認証済みユーザーが存在しない場合のエラー。
 *
 * provider 未確定の段階では redirect や Next.js auth interrupt に結び付けず、呼び出し側の境界で扱う。
 */
export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

/**
 * 認証済みだが必要ロールを持たない場合のエラー。
 *
 * Admin Zone や将来の Server Action で、RBAC の失敗条件を provider 非依存に表す。
 */
export class ForbiddenError extends Error {
  constructor() {
    super("Forbidden");
    this.name = "ForbiddenError";
  }
}

/**
 * 認証済みユーザーを要求する。
 *
 * @param user 検証対象の認証ユーザー
 * @returns 認証済みユーザー
 * @throws UnauthorizedError `user` が `null` の場合
 */
export function requireAuthenticatedUser(user: AuthUser | null): AuthUser {
  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
}

/**
 * 指定ロールを持つ認証済みユーザーを要求する。
 *
 * @param user 検証対象の認証ユーザー
 * @param role 要求するロール
 * @returns 要求ロールを持つ認証済みユーザー
 * @throws UnauthorizedError `user` が `null` の場合
 * @throws ForbiddenError `user.role` が要求ロールと一致しない場合
 */
export function requireRole(user: AuthUser | null, role: UserRole): AuthUser {
  const authenticatedUser = requireAuthenticatedUser(user);

  if (authenticatedUser.role !== role) {
    throw new ForbiddenError();
  }

  return authenticatedUser;
}

/**
 * Admin Zone 用に管理者ロールを要求する。
 *
 * @param user 検証対象の認証ユーザー
 * @returns `admin` ロールを持つ認証済みユーザー
 * @throws UnauthorizedError `user` が `null` の場合
 * @throws ForbiddenError `user.role` が `admin` ではない場合
 */
export function requireAdmin(user: AuthUser | null): AuthUser {
  return requireRole(user, "admin");
}
