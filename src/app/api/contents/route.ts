import { getContentCatalogItems } from "@/features/contents/server/content-read-service";

/**
 * コンテンツカタログ API。
 *
 * @returns 一覧掲載対象のコンテンツ一覧。
 */
export async function GET() {
  const items = await getContentCatalogItems();

  return Response.json(items.map((item) => item.content));
}
