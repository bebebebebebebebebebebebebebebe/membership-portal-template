import { describe, expect, it } from "vitest";

import { getContentRouteAccessKindForProxy } from "@/config/content-route-access-manifest";
import { mockContents } from "@/features/contents/data/mock-contents";

describe("content route access manifest", () => {
  it("member-only-blueprint を loginRequired として返す", () => {
    expect(getContentRouteAccessKindForProxy("member-only-blueprint")).toBe(
      "loginRequired"
    );
  });

  it("manifest 未登録 ID は public として返す", () => {
    expect(getContentRouteAccessKindForProxy("unknown-content")).toBe("public");
  });

  it("manifest の loginRequired ID は mock content の routeAccessPolicy と一致する", () => {
    const content = mockContents.find(
      (item) => item.id === "member-only-blueprint"
    );

    expect(content?.routeAccessPolicy.kind).toBe("loginRequired");
  });
});
