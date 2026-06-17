import { getPublicContentPreview } from "@/features/contents/server/content-read-service";

type ContentPreviewRouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * コンテンツ preview API。
 *
 * @param _request 利用しない HTTP request。
 * @param context dynamic segment の params。
 * @returns 認可前に表示可能な preview。
 */
export async function GET(
  _request: Request,
  context: ContentPreviewRouteContext
) {
  const { id } = await context.params;
  const preview = await getPublicContentPreview(id);

  if (!preview) {
    return Response.json({ error: "Content preview not found" }, { status: 404 });
  }

  return Response.json(preview);
}
