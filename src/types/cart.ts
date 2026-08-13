export interface CartItem {
  lineId: string;
  productId: string;
  productSlug?: string;
  variantId: string;
  name: string;
  variantName?: string;
  grade?: string;
  imageUrl?: string;
  price: number;
  saleUnit?: string;
  saleQuantity?: number;
  quantity: number;
}
