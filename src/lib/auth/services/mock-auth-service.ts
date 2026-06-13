import "server-only";

import type { AuthService } from "@/lib/auth/auth-service";
import type { AuthScenario, AuthState, AuthUser } from "@/types/auth";

const mockUsers = {
  freeMember: {
    name: "無料 会員",
    email: "free.member@example.com",
    avatar: "/images/avatars/avatar-02.jpg",
    initials: "無料",
    membership: "無料会員",
    role: "member",
  },
  standardMember: {
    name: "標準 会員",
    email: "standard.member@example.com",
    avatar: "/images/avatars/avatar-04.jpg",
    initials: "標準",
    membership: "スタンダード会員",
    role: "member",
  },
  premiumMember: {
    name: "山田 太郎",
    email: "taro.yamada@example.com",
    avatar: "/images/avatars/avatar-06.jpg",
    initials: "山田",
    membership: "プレミアム会員",
    role: "member",
  },
  admin: {
    name: "管理 太郎",
    email: "admin@example.com",
    avatar: "/images/avatars/avatar-06.jpg",
    initials: "管理",
    membership: "プレミアム会員",
    role: "admin",
  },
} satisfies Record<string, AuthUser>;

const scenarioStates = {
  anonymous: {
    user: null,
    purchasedProductIds: [],
  },
  "free-member": {
    user: mockUsers.freeMember,
    purchasedProductIds: [],
  },
  "standard-member": {
    user: mockUsers.standardMember,
    purchasedProductIds: [],
  },
  "premium-member": {
    user: mockUsers.premiumMember,
    purchasedProductIds: [],
  },
  admin: {
    user: mockUsers.admin,
    purchasedProductIds: [],
  },
  "purchased-member": {
    user: mockUsers.freeMember,
    purchasedProductIds: [
      "product-security-checklist",
      "product-modern-javascript",
    ],
  },
} satisfies Record<AuthScenario, AuthState>;

/**
 * 指定 scenario の AuthState を返す mock auth service を作成する。
 *
 * @param scenario 開発・デモ用に固定する認証シナリオ。
 * @returns provider 非依存の AuthService 実装。
 */
export function createMockAuthService(scenario: AuthScenario): AuthService {
  return {
    async getAuthState() {
      return scenarioStates[scenario];
    },
  };
}
