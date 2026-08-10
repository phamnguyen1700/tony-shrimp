import { apiClient } from "@/config/api";
import { endpoints } from "@/config/endpoints";
import type {
  CreateOrderPayload,
  OrderDetail,
  OrderListQuery,
  OrderListResponse,
  OwnerOrderListQuery,
  UpdateOwnerOrderStatusPayload,
  UpdateOwnerOrderTrackingPayload,
} from "@/types/order";

export const orderService = {
  async createOrder(payload: CreateOrderPayload) {
    const response = await apiClient.post<OrderDetail>(endpoints.orders.orders, payload);
    return response.data;
  },

  async listOrders(params?: OrderListQuery) {
    const response = await apiClient.get<OrderListResponse>(endpoints.orders.orders, { params });
    return response.data;
  },

  async getOrder(orderId: string) {
    const response = await apiClient.get<OrderDetail>(endpoints.orders.order(orderId));
    return response.data;
  },

  async listOwnerOrders(params?: OwnerOrderListQuery) {
    const response = await apiClient.get<OrderListResponse>(endpoints.ownerOrders.orders, { params });
    return response.data;
  },

  async getOwnerOrder(orderId: string) {
    const response = await apiClient.get<OrderDetail>(endpoints.ownerOrders.order(orderId));
    return response.data;
  },

  async updateOwnerOrderStatus(orderId: string, payload: UpdateOwnerOrderStatusPayload) {
    const response = await apiClient.patch<OrderDetail>(
      endpoints.ownerOrders.status(orderId),
      payload,
    );
    return response.data;
  },

  async updateOwnerOrderTracking(orderId: string, payload: UpdateOwnerOrderTrackingPayload) {
    const response = await apiClient.patch<OrderDetail>(
      endpoints.ownerOrders.tracking(orderId),
      payload,
    );
    return response.data;
  },
};
