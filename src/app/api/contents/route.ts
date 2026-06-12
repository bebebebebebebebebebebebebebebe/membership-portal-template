import { getMockContents } from "@/features/contents/server/mock-content-repository";

export const dynamic = "force-dynamic";

/**
 * コンテンツカタログ API。
 *
 * @returns 一覧掲載対象のコンテンツ一覧。
 */
export async function GET() {
  return Response.json(getMockContents());
}
