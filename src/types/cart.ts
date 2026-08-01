export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  grade?: string;
  imageKey: string;
  price: number;
  quantity: number;
}
