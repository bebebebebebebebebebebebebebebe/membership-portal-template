import { getContentViewer } from "@/features/contents/server/content-viewer";
import { getAuthorizedContentDetail } from "@/features/contents/server/content-read-queries";

type ContentDetailRouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * コンテンツ full detail API。
 *
 * full body は閲覧条件を満たした場合だけ返す。metadata が非公開、または detail
 * が存在しない場合は 404、閲覧条件を満たさない場合は 403 を返す。
 *
 * @param _request - 利用しない HTTP request。
 * @param context - dynamic segment の params。
 * @returns 認可済みの full detail。
 */
export async function GET(
  _request: Request,
  context: ContentDetailRouteContext
) {
  const { id } = await context.params;
  const viewer = await getContentViewer();
  const result = await getAuthorizedContentDetail(id, viewer);

  switch (result.status) {
    case "ok":
      return Response.json(result.detail);
    case "forbidden":
      return Response.json({ error: "Forbidden" }, { status: 403 });
    case "notFound":
      return Response.json({ error: "Content detail not found" }, { status: 404 });
  }
}
