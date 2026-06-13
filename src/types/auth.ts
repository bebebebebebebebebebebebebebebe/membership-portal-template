/**
 * 認証済みユーザーに付与するアプリケーション内ロール。
 *
 * Member Zone は認証済みであれば利用可能とし、Admin Zone では `admin` を要求する。
 */
export type UserRole = "member" | "admin";

/**
 * 認証状態を解決する provider の種類。
 *
 * `mock` は開発・デモ、`test` は Vitest の明示的な状態差し替え、
 * `real` は将来の実認証 provider 接続に使う。
 */
export type AuthProviderKind = "mock" | "real" | "test";

/**
 * mock auth service が返す認証シナリオ。
 *
 * UI と認可境界で、未ログイン・会員プラン・管理者・購入済み状態を
 * server-side に切り替えるための識別子。
 */
export type AuthScenario =
  | "anonymous"
  | "free-member"
  | "standard-member"
  | "premium-member"
  | "admin"
  | "purchased-member";

/**
 * provider 非依存で扱う認証ユーザー情報。
 *
 * ヘッダー・コメント入力・将来の RBAC 判定で共有する最小のユーザー表示情報とロールを表す。
 */
export type AuthUser = {
  name: string;
  email: string;
  avatar: string;
  /** アバター画像が読み込めない場合の Avatar フォールバック表示。 */
  initials: string;
  /** 会員種別ラベル。 */
  membership: string;
  role: UserRole;
};

/**
 * server-side auth service が返す現在の認証状態。
 *
 * `user` は表示・ロール判定用 DTO、`purchasedProductIds` はコンテンツ単品購入の
 * 閲覧判定に使う productId の集合を表す。
 */
export type AuthState = {
  user: AuthUser | null;
  purchasedProductIds: string[];
};
