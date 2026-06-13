"use client";

import { createContext, useContext, useMemo } from "react";

import type { AuthUser } from "@/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Server Component から渡された認証ユーザー DTO を Client Component に共有する。
 *
 * @param props.initialUser server-side auth service で解決済みのユーザー。
 * @param props.children 認証表示 state を参照する subtree。
 * @returns 認証表示 state を提供する context provider。
 */
export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: AuthUser | null;
  children: React.ReactNode;
}) {
  const value = useMemo<AuthContextValue>(
    () => ({
      user: initialUser,
      isAuthenticated: Boolean(initialUser),
      isAdmin: initialUser?.role === "admin",
    }),
    [initialUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * AuthProvider が提供する client-side 表示用 auth state を取得する。
 *
 * @returns 現在ユーザーと認証・admin 判定の表示用 state。
 * @throws AuthProvider の外側で呼ばれた場合。
 */
export function useAuthContext(): AuthContextValue {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return value;
}
