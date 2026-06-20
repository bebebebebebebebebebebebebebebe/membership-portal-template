import { getProductOffer } from "@/features/contents/server/content-read-queries";

type ProductOfferRouteContext = {
  params: Promise<{ productId: string }>;
};

/**
 * 販売オファー API。
 *
 * @param _request - 利用しない HTTP request。
 * @param context - dynamic segment の params。
 * @returns 価格や販売可否を含む販売情報。
 */
export async function GET(
  _request: Request,
  context: ProductOfferRouteContext
) {
  const { productId } = await context.params;
  const offer = await getProductOffer(productId);

  if (!offer) {
    return Response.json({ error: "Product offer not found" }, { status: 404 });
  }

  return Response.json(offer);
}
