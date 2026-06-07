import type { AuthUser } from "@/types/auth";

/**
 * 認証基盤が未確定の間に利用する現在ユーザーのモック。
 *
 * 将来の provider 導入時は `getCurrentUser()` の内部実装を差し替え、この値への UI 直接依存を増やさない。
 */
export const mockCurrentUser: AuthUser = {
  name: "山田 太郎",
  email: "taro.yamada@example.com",
  avatar: "/images/avatars/avatar-06.jpg",
  initials: "山田",
  membership: "プレミアム会員",
  role: "member",
};
