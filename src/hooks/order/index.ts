import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import {
  getInsufficientStockItems,
  isOrderActionUnavailableError,
} from "@/config/api";
import { getLocalizedApiErrorMessage } from "@/lib/config/apiErrorMessages";
import { useAppRuntime } from "@/providers/AppProviders";
import {
  createOrderSchema,
  orderListQuerySchema,
  ownerOrderListQuerySchema,
  updateOwnerOrderStatusSchema,
} from "@/schema/order";
import { orderService } from "@/services/order";
import type {
  CreateOrderPayload,
  OrderListQuery,
  OwnerOrderListQuery,
  UpdateOwnerOrderStatusPayload,
} from "@/types/order";

export const orderQueryKeys = {
  customerList: (params?: OrderListQuery) => ["orders", params ?? {}] as const,
  customerDetail: (orderId: string) => ["orders", orderId] as const,
  paymentSession: (sessionId: string) =>
    ["orders", "payment-session", sessionId] as const,
  ownerList: (params?: OwnerOrderListQuery) =>
    ["owner", "orders", params ?? {}] as const,
  ownerDetail: (orderId: string) => ["owner", "orders", orderId] as const,
};

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { t } = useAppRuntime();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      orderService.createOrder(createOrderSchema.parse(payload)),
    onSuccess: (checkout) => {
      toast.success("Checkout created.");
      queryClient.setQueryData(
        orderQueryKeys.customerDetail(checkout.order.id),
        checkout.order,
      );
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      const stockItems = getInsufficientStockItems(error);
      if (stockItems) {
        toast.error(t.apiErrors.insufficientStock);
        return;
      }
      toast.error(getLocalizedApiErrorMessage(error, t, t.apiErrors.placeOrderFailed));
    },
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

export function useOrderByPaymentSession(sessionId: string, enabled = true) {
  const pollingStartedAt = useMemo(() => Date.now(), [sessionId]);

  return useQuery({
    queryKey: orderQueryKeys.paymentSession(sessionId),
    queryFn: () => orderService.getOrderByPaymentSession(sessionId),
    enabled: Boolean(sessionId) && enabled,
    refetchInterval: (query) => {
      const order = query.state.data;
      return order?.status === "processing" &&
        order.payment_status === "pending" &&
        Date.now() - pollingStartedAt < 30000
        ? 3000
        : false;
    },
  });
}

export function useContinuePayment(orderId: string) {
  const queryClient = useQueryClient();
  const { t } = useAppRuntime();

  return useMutation({
    mutationFn: () => orderService.continuePayment(orderId),
    onSuccess: (checkout) => {
      queryClient.setQueryData(
        orderQueryKeys.customerDetail(checkout.order.id),
        checkout.order,
      );
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      void queryClient.invalidateQueries({
        queryKey: orderQueryKeys.customerDetail(orderId),
      });
      void queryClient.invalidateQueries({ queryKey: ["orders"] });

      toast.error(
        isOrderActionUnavailableError(error)
          ? t.apiErrors.paymentUnavailable
          : getLocalizedApiErrorMessage(error, t, t.apiErrors.continuePaymentFailed),
      );
    },
  });
}

export function useCancelOrder(orderId: string) {
  const queryClient = useQueryClient();
  const { t } = useAppRuntime();

  return useMutation({
    mutationFn: () => orderService.cancelOrder(orderId),
    onSuccess: (order) => {
      toast.success("Order cancelled.");
      queryClient.setQueryData(orderQueryKeys.customerDetail(order.id), order);
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      void queryClient.invalidateQueries({
        queryKey: orderQueryKeys.customerDetail(orderId),
      });
      void queryClient.invalidateQueries({ queryKey: ["orders"] });

      toast.error(
        isOrderActionUnavailableError(error)
          ? t.apiErrors.orderNoLongerCancellable
          : getLocalizedApiErrorMessage(error, t, t.apiErrors.cancelOrderFailed),
      );
    },
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
  const { t } = useAppRuntime();

  return useOwnerOrderMutation(
    (payload: UpdateOwnerOrderStatusPayload) =>
      orderService.updateOwnerOrderStatus(
        orderId,
        updateOwnerOrderStatusSchema.parse(payload),
      ),
    "Order status updated.",
    t.apiErrors.updateOrderStatusFailed,
  );
}

function useOwnerOrderMutation<TPayload>(
  mutationFn: (
    payload: TPayload,
  ) => ReturnType<typeof orderService.getOwnerOrder>,
  successMessage: string,
  errorMessage: string,
) {
  const queryClient = useQueryClient();
  const { t } = useAppRuntime();

  return useMutation({
    mutationFn,
    onSuccess: (order) => {
      toast.success(successMessage);
      queryClient.setQueryData(orderQueryKeys.ownerDetail(order.id), order);
      void queryClient.invalidateQueries({ queryKey: ["owner", "orders"] });
    },
    onError: (error) => toast.error(getLocalizedApiErrorMessage(error, t, errorMessage)),
  });
}
