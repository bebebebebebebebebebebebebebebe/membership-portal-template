import { getMockContentMetadata } from "@/features/contents/server/mock-content-repository";

type ContentMetadataRouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * コンテンツ metadata API。
 *
 * @param _request 利用しない HTTP request。
 * @param context dynamic segment の params。
 * @returns 認可前に取得可能な metadata。
 */
export async function GET(
  _request: Request,
  context: ContentMetadataRouteContext
) {
  const { id } = await context.params;
  const content = getMockContentMetadata(id);

  if (!content) {
    return Response.json({ error: "Content not found" }, { status: 404 });
  }

  return Response.json(content);
}
