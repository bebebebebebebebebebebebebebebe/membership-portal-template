import { forbidden, redirect } from "next/navigation";

import { createLoginRedirectPath } from "@/lib/auth/auth-redirect";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import type { AuthUser, UserRole } from "@/types/auth";

type CurrentRouteGuardOptions = {
  nextPath: string;
};

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
 * @param user - 検証対象の認証ユーザー
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
 * @param user - 検証対象の認証ユーザー
 * @param role - 要求するロール
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
 * @param user - 検証対象の認証ユーザー
 * @returns `admin` ロールを持つ認証済みユーザー
 * @throws UnauthorizedError `user` が `null` の場合
 * @throws ForbiddenError `user.role` が `admin` ではない場合
 */
export function requireAdmin(user: AuthUser | null): AuthUser {
  return requireRole(user, "admin");
}

/**
 * 現在 request の認証済みユーザーを要求し、未ログインなら login route へ遷移する。
 *
 * @returns 認証済みユーザー。
 */
export async function requireCurrentUser(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * Member route 表示に必要な現在 request の認証済みユーザーを要求する。
 *
 * 未ログイン時は login route に復帰先を付けて遷移する。Member layout などの
 * route guard から利用する。
 *
 * @param options - `nextPath` はログイン後に戻す Member route path。
 * @returns 認証済みユーザー。
 */
export async function requireCurrentUserForRoute({
  nextPath,
}: CurrentRouteGuardOptions): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect(createLoginRedirectPath(nextPath));
  }

  return user;
}

/**
 * 現在 request の admin ユーザーを要求する。
 *
 * @returns `admin` ロールを持つ認証済みユーザー。
 */
export async function requireCurrentAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    forbidden();
  }

  return user;
}

/**
 * Admin route 表示に必要な現在 request の admin ユーザーを要求する。
 *
 * 未ログイン時は login route に復帰先を付けて遷移し、非 admin ユーザーは安定した
 * `/forbidden` route へ遷移する。Admin layout などの route guard から利用する。
 *
 * @param options - `nextPath` はログイン後に戻す Admin route path。
 * @returns `admin` ロールを持つ認証済みユーザー。
 */
export async function requireCurrentAdminForRoute({
  nextPath,
}: CurrentRouteGuardOptions): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect(createLoginRedirectPath(nextPath));
  }

  if (user.role !== "admin") {
    redirect("/forbidden");
  }

  return user;
}
