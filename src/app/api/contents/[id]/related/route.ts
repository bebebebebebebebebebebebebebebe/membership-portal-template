import { getMockRelatedContents } from "@/features/contents/server/mock-content-repository";

export const dynamic = "force-dynamic";

type RelatedContentsRouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * 関連コンテンツ API。
 *
 * @param request `limit` query を含み得る HTTP request。
 * @param context dynamic segment の params。
 * @returns 一覧掲載対象に限定した関連コンテンツ。
 */
export async function GET(
  request: Request,
  context: RelatedContentsRouteContext
) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const requestedLimit = Number(searchParams.get("limit") ?? 4);
  const limit = Number.isFinite(requestedLimit) ? requestedLimit : 4;

  return Response.json(getMockRelatedContents(id, limit));
}
