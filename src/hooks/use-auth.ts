"use client";

import { useAuthContext } from "@/components/providers/auth-provider";

/**
 * Client Component から表示補助用の認証 state を参照する。
 *
 * @returns AuthProvider で共有された現在ユーザーと認証状態。
 */
export function useAuth() {
  return useAuthContext();
}
