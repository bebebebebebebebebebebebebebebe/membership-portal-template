/**
 * 認証済みユーザーに付与するアプリケーション内ロール。
 *
 * Member Zone は認証済みであれば利用可能とし、Admin Zone では `admin` を要求する。
 */
export type UserRole = "member" | "admin";

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
