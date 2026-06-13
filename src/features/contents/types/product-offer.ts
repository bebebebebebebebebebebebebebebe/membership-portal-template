/** 販売オファーで扱う通貨。 */
export type Currency = "JPY";

/**
 * 単品購入対象コンテンツの販売条件。
 *
 * accessPolicy には productId だけを持たせ、価格や販売可否はこの型で分離する。
 */
export type ProductOffer = {
  productId: string;
  price: number;
  currency: Currency;
  taxIncluded: boolean;
  available: boolean;
};
