"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  useOwnerOrderDetail,
  useUpdateOwnerOrderStatus,
} from "@/hooks/order";
import { useAppRuntime } from "@/providers/AppProviders";
import OrderDetailSummary from "@/features/order-tracking/components/OrderDetailSummary";
import OrderItemsList from "@/features/order-tracking/components/OrderItemsList";
import OrderShippingAddress from "@/features/order-tracking/components/OrderShippingAddress";
import OrderTrackingCard from "@/features/order-tracking/components/OrderTrackingCard";
import AdminOrderHeader from "./components/AdminOrderHeader";
import AdminOrderTimeline from "./components/AdminOrderTimeline";

export default function AdminOrderDetailFeature({ id }: { id: string }) {
  const { t } = useAppRuntime();
  const reduced = useReducedMotion();
  const orderQuery = useOwnerOrderDetail(id);
  const updateStatusMutation = useUpdateOwnerOrderStatus(id);
  const isMutating = updateStatusMutation.isPending;
  const order = orderQuery.data;

  async function markShipped() {
    try {
      await updateStatusMutation.mutateAsync({
        status: "shipped",
        message: "Order shipped.",
        status_at: null,
      });
    } catch {
      // Mutation hooks own the toast messages.
    }
  }

  if (orderQuery.isLoading) {
    return (
      <div className="p-8">
        <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
          Loading order...
        </p>
      </div>
    );
  }

  if (!order || orderQuery.isError) {
    return (
      <div className="p-8">
        <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
          Order not found.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl p-6 md:p-8">
      <AdminOrderHeader t={t} order={order} reduced={reduced} />

      <div className="grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_320px] md:gap-10 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <AdminOrderTimeline
            t={t}
            order={order}
            reduced={reduced}
            isMutating={isMutating}
            onMarkShipped={markShipped}
          />
          <OrderTrackingCard t={t} order={order} reduced={reduced} />
          <OrderItemsList order={order} reduced={reduced} />
        </div>

        <motion.div
          className="space-y-6"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <OrderDetailSummary t={t} order={order} />
          <OrderShippingAddress order={order} />
        </motion.div>
      </div>
    </div>
  );
}
