"use client";

import { motion, useReducedMotion } from "motion/react";
import { useAppRuntime } from "@/providers/AppProviders";
import { useMyOrderDetail } from "@/hooks/order";
import OrderDetailSummary from "./components/OrderDetailSummary";
import OrderItemsList from "./components/OrderItemsList";
import OrderShippingAddress from "./components/OrderShippingAddress";
import OrderTimeline from "./components/OrderTimeline";
import OrderPaymentActions from "./components/OrderPaymentActions";
import OrderTrackingCard from "./components/OrderTrackingCard";
import OrderTrackingHeader from "./components/OrderTrackingHeader";

export default function OrderTrackingFeature({ id }: { id: string }) {
  const { t } = useAppRuntime();
  const reduced = useReducedMotion();
  const orderQuery = useMyOrderDetail(id);
  const order = orderQuery.data;

  if (orderQuery.isLoading) {
    return (
      <div className="app-page">
        <div className="app-container">
          <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
            Loading order...
          </p>
        </div>
      </div>
    );
  }

  if (!order || orderQuery.isError) {
    return (
      <div className="app-page">
        <div className="app-container">
          <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
            Order not found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page">
      <div className="mx-auto max-w-screen-lg px-4 py-8 md:px-8 md:py-12">
        <OrderTrackingHeader t={t} order={order} reduced={reduced} />

        <div className="grid items-start gap-8 md:grid-cols-[1fr_320px] md:gap-12">
          <div>
            <OrderTimeline t={t} order={order} reduced={reduced} />
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
            <OrderPaymentActions order={order} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
