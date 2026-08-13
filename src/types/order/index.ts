export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentProvider = "stripe";

export interface CreateOrderItemPayload {
  variant_id: string;
  quantity: number;
}

export interface CreateOrderPayload {
  shipping_address_id: string;
  items: CreateOrderItemPayload[];
  customer_note?: string | null;
}

export interface OrderAddressSnapshot {
  recipient_name: string;
  recipient_phone: string;
  address_line1: string;
  address_line2: string | null;
  suburb: string;
  state: string;
  postcode: string;
}

export interface OrderItemSnapshot {
  id: string;
  shrimp_id: string;
  variant_id: string;
  shrimp_name: string;
  variant_name: string;
  sale_unit: string;
  sale_quantity: number;
  image_url: string | null;
  unit_price: string;
  quantity: number;
  line_total: string;
  created_at: string;
}

export interface OrderStatusEvent {
  id: string;
  status: OrderStatus;
  message: string | null;
  created_by_user_id: string | null;
  created_at: string;
}

export interface OrderSummary {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_provider: PaymentProvider;
  subtotal_amount: string;
  shipping_amount: string;
  total_amount: string;
  currency: string;
  customer_note: string | null;
  created_at: string;
  updated_at: string;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  paid_at: string | null;
  payment_failed_at: string | null;
  cancelled_reason: string | null;
  stripe_checkout_url?: string | null;
  stripe_checkout_expires_at?: string | null;
}

export interface OrderDetail extends OrderSummary {
  shipping_address: OrderAddressSnapshot;
  items: OrderItemSnapshot[];
  status_events: OrderStatusEvent[];
}

export interface OrderListResponse {
  items: OrderSummary[];
  total: number;
  limit: number;
  offset: number;
}

export interface OrderListQuery {
  limit?: number;
  offset?: number;
}

export interface CheckoutOrderResponse {
  order: OrderDetail;
  checkout_url: string;
  stripe_session_id: string;
  stripe_checkout_expires_at: string;
  payment_status: PaymentStatus;
  payment_provider: PaymentProvider;
}

export interface OwnerOrderListQuery extends OrderListQuery {
  status?: OrderStatus;
  search?: string;
}

export interface UpdateOwnerOrderStatusPayload {
  status: OrderStatus;
  message?: string | null;
  status_at?: string | null;
}
