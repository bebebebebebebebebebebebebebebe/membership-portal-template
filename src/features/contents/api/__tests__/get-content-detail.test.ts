import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";

import { getContentDetail } from "@/features/contents/api/get-content-detail";
import { server } from "@/testing/mocks/server";

describe("getContentDetail", () => {
  it("記事 id に対して full detail（本文セクション・コメント）を返す", async () => {
    const detail = await getContentDetail("1");

    expect(detail).toBeDefined();
    expect(detail?.sections.length).toBeGreaterThan(0);
    expect(detail?.comments).toBeDefined();
    expect(detail?.summary.body).toBeTruthy();
  });

  it("詳細データを持たない id には undefined を返す", async () => {
    await expect(getContentDetail("does-not-exist")).resolves.toBeUndefined();
  });

  it("閲覧不可の detail API は 403 error として扱う", async () => {
    server.use(
      http.get("*/api/contents/:id/detail", () =>
        HttpResponse.json({ error: "Forbidden" }, { status: 403 })
      )
    );

    await expect(getContentDetail("1")).rejects.toMatchObject({
      status: 403,
    });
  });
});
