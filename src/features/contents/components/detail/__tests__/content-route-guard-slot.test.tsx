import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ArticleContent } from "@/features/contents/types/content";
import type { ContentViewer } from "@/features/contents/types/content-viewer";
import type { AuthUser } from "@/types/auth";

const mocks = vi.hoisted(() => ({
  getContentViewer: vi.fn(),
  PersonalizedContentAccess: vi.fn(() => null),
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`);
  }),
}));

vi.mock("@/features/contents/api/get-content-viewer", () => ({
  getContentViewer: mocks.getContentViewer,
}));
vi.mock("@/features/contents/components/detail/personalized-content-access", () => ({
  PersonalizedContentAccess: mocks.PersonalizedContentAccess,
}));
vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

import { ContentRouteGuardSlot } from "../content-route-guard-slot";

const memberUser: AuthUser = {
  name: "一般 会員",
  email: "member@example.com",
  avatar: "/images/avatars/avatar-01.jpg",
  initials: "一般",
  membership: "無料会員",
  role: "member",
};

const anonymousViewer: ContentViewer = {
  user: null,
  plan: null,
  purchasedProductIds: [],
};

const memberViewer: ContentViewer = {
  user: memberUser,
  plan: "free",
  purchasedProductIds: [],
};

function makeContent(
  routeAccessPolicy: ArticleContent["routeAccessPolicy"]
): ArticleContent {
  return {
    id: "member-only-blueprint",
    category: "記事",
    title: "会員限定ブループリント",
    description: "説明",
    thumbnail: "/images/contents/sample.png",
    tags: ["会員限定"],
    publicationStatus: "published",
    discoverability: "unlisted",
    routeAccessPolicy,
    accessPolicy: { kind: "free" },
    author: { name: "著者", avatar: "/images/avatar.png", initials: "AB" },
    date: "2026-06-01",
    readMinutes: 5,
  };
}

describe("ContentRouteGuardSlot", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loginRequired route の anonymous user を next 付き login へ redirect する", async () => {
    mocks.getContentViewer.mockResolvedValue(anonymousViewer);

    await expect(
      ContentRouteGuardSlot({
        id: "member-only-blueprint",
        content: makeContent({ kind: "loginRequired" }),
      })
    ).rejects.toThrow(
      "redirect:/login?next=%2Fcontents%2Fmember-only-blueprint"
    );
  });

  it("loginRequired route の authenticated user を personalized access へ進める", async () => {
    const content = makeContent({ kind: "loginRequired" });
    mocks.getContentViewer.mockResolvedValue(memberViewer);

    render(
      await ContentRouteGuardSlot({
        id: "member-only-blueprint",
        content,
      })
    );

    expect(mocks.PersonalizedContentAccess).toHaveBeenCalledWith(
      {
        id: "member-only-blueprint",
        content,
        viewer: memberViewer,
      },
      undefined
    );
  });
});
