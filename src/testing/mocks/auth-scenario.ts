import type { MembershipPlan } from "@/features/contents/types/content-access";
import type { ContentViewer } from "@/features/contents/types/content-viewer";
import type { AuthScenario, AuthUser } from "@/types/auth";

const browserAuthScenarios = [
  "anonymous",
  "free-member",
  "standard-member",
  "premium-member",
  "admin",
  "purchased-member",
] as const satisfies AuthScenario[];

const browserMockUsers = {
  "free-member": {
    name: "無料 会員",
    email: "free.member@example.com",
    avatar: "/images/avatars/avatar-02.jpg",
    initials: "無料",
    membership: "無料会員",
    role: "member",
  },
  "standard-member": {
    name: "標準 会員",
    email: "standard.member@example.com",
    avatar: "/images/avatars/avatar-04.jpg",
    initials: "標準",
    membership: "スタンダード会員",
    role: "member",
  },
  "premium-member": {
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
} satisfies Record<Exclude<AuthScenario, "anonymous" | "purchased-member">, AuthUser>;

function isBrowserAuthScenario(value: string): value is AuthScenario {
  return browserAuthScenarios.includes(value as AuthScenario);
}

function toMembershipPlan(membership: string | undefined): MembershipPlan | null {
  switch (membership) {
    case "プレミアム会員":
      return "premium";
    case "スタンダード会員":
      return "standard";
    case "無料会員":
      return "free";
    default:
      return null;
  }
}

/**
 * browser MSW handler 用の mock auth scenario を環境変数から解決する。
 *
 * @returns `NEXT_PUBLIC_AUTH_MOCK_SCENARIO` が有効値ならその値、不正または未指定なら `premium-member`。
 */
export function getBrowserAuthScenario(): AuthScenario {
  const scenario = process.env.NEXT_PUBLIC_AUTH_MOCK_SCENARIO;

  if (scenario && isBrowserAuthScenario(scenario)) {
    return scenario;
  }

  return "premium-member";
}

/**
 * browser MSW handler 用の ContentViewer を mock scenario から作る。
 *
 * @returns client-safe な user / plan / purchasedProductIds を含む viewer。
 */
export function getBrowserMockViewer(): ContentViewer {
  const scenario = getBrowserAuthScenario();

  if (scenario === "anonymous") {
    return {
      user: null,
      plan: null,
      purchasedProductIds: [],
    };
  }

  const user =
    scenario === "purchased-member"
      ? browserMockUsers["free-member"]
      : browserMockUsers[scenario];

  return {
    user,
    plan: toMembershipPlan(user.membership),
    purchasedProductIds:
      scenario === "purchased-member"
        ? ["product-security-checklist", "product-modern-javascript"]
        : [],
  };
}
