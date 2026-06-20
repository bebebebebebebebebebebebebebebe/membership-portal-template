import type { AuthState } from "@/types/auth";

const anonymousAuthState: AuthState = {
  user: null,
  purchasedProductIds: [],
};

let currentTestAuthState: AuthState = anonymousAuthState;

/**
 * Vitest 内で現在の認証状態を明示的に差し替える。
 *
 * @param state - テスト対象へ返したい AuthState。
 */
export function setTestAuthState(state: AuthState): void {
  currentTestAuthState = state;
}

/**
 * Vitest 用 auth service が返す現在の認証状態を取得する。
 *
 * @returns 最後に `setTestAuthState` で設定された AuthState。
 */
export function getTestAuthState(): AuthState {
  return currentTestAuthState;
}

/**
 * テスト間で認証状態を未ログインへ戻す。
 */
export function resetTestAuthState(): void {
  currentTestAuthState = anonymousAuthState;
}
