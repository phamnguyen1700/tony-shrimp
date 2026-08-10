import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/config/api";
import {
  createOrderSchema,
  orderListQuerySchema,
  ownerOrderListQuerySchema,
  updateOwnerOrderStatusSchema,
  updateOwnerOrderTrackingSchema,
} from "@/schema/order";
import { orderService } from "@/services/order";
import type {
  CreateOrderPayload,
  OrderListQuery,
  OwnerOrderListQuery,
  UpdateOwnerOrderStatusPayload,
  UpdateOwnerOrderTrackingPayload,
} from "@/types/order";

export const orderQueryKeys = {
  customerList: (params?: OrderListQuery) => ["orders", params ?? {}] as const,
  customerDetail: (orderId: string) => ["orders", orderId] as const,
  ownerList: (params?: OwnerOrderListQuery) => ["owner", "orders", params ?? {}] as const,
  ownerDetail: (orderId: string) => ["owner", "orders", orderId] as const,
};

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      orderService.createOrder(createOrderSchema.parse(payload)),
    onSuccess: (order) => {
      toast.success("Order placed.");
      queryClient.setQueryData(orderQueryKeys.customerDetail(order.id), order);
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not place order.")),
  });
}

export function useMyOrders(params?: OrderListQuery, enabled = true) {
  const validParams = orderListQuerySchema.parse(params ?? {});

  return useQuery({
    queryKey: orderQueryKeys.customerList(validParams),
    queryFn: () => orderService.listOrders(validParams),
    enabled,
  });
}

export function useMyOrderDetail(orderId: string) {
  return useQuery({
    queryKey: orderQueryKeys.customerDetail(orderId),
    queryFn: () => orderService.getOrder(orderId),
    enabled: Boolean(orderId),
  });
}

export function useOwnerOrders(params?: OwnerOrderListQuery) {
  const validParams = ownerOrderListQuerySchema.parse(params ?? {});

  return useQuery({
    queryKey: orderQueryKeys.ownerList(validParams),
    queryFn: () => orderService.listOwnerOrders(validParams),
  });
}

export function useOwnerOrderDetail(orderId: string) {
  return useQuery({
    queryKey: orderQueryKeys.ownerDetail(orderId),
    queryFn: () => orderService.getOwnerOrder(orderId),
    enabled: Boolean(orderId),
  });
}

export function useUpdateOwnerOrderStatus(orderId: string) {
  return useOwnerOrderMutation(
    (payload: UpdateOwnerOrderStatusPayload) =>
      orderService.updateOwnerOrderStatus(orderId, updateOwnerOrderStatusSchema.parse(payload)),
    "Order status updated.",
    "Could not update order status.",
  );
}

export function useUpdateOwnerOrderTracking(orderId: string) {
  return useOwnerOrderMutation(
    (payload: UpdateOwnerOrderTrackingPayload) =>
      orderService.updateOwnerOrderTracking(orderId, updateOwnerOrderTrackingSchema.parse(payload)),
    "Tracking updated.",
    "Could not update tracking.",
  );
}

function useOwnerOrderMutation<TPayload>(
  mutationFn: (payload: TPayload) => ReturnType<typeof orderService.getOwnerOrder>,
  successMessage: string,
  errorMessage: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (order) => {
      toast.success(successMessage);
      queryClient.setQueryData(orderQueryKeys.ownerDetail(order.id), order);
      void queryClient.invalidateQueries({ queryKey: ["owner", "orders"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, errorMessage)),
  });
}
