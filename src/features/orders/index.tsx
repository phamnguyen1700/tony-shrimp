"use client";

import { useReducedMotion } from "motion/react";
import { useAppRuntime } from "@/providers/AppProviders";
import { useMyOrders } from "@/hooks/order";
import { useAuthStore } from "@/store/authStore";
import OrdersEmptyState from "./components/OrdersEmptyState";
import OrdersHeader from "./components/OrdersHeader";
import OrderSummaryCard from "./components/OrderSummaryCard";

export default function OrdersFeature() {
  const { t } = useAppRuntime();
  const reduced = useReducedMotion();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const ordersQuery = useMyOrders({ limit: 20, offset: 0 }, Boolean(user));

  if (!isHydrated) {
    return (
      <div className="app-page">
        <div className="mx-auto max-w-screen-lg px-4 py-8 md:px-8 md:py-12">
          <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  const orders = ordersQuery.data?.items ?? [];

  return (
    <div className="app-page">
      <div className="mx-auto max-w-screen-lg px-4 py-8 md:px-8 md:py-12">
        <OrdersHeader t={t} reduced={reduced} />

        <div className="space-y-4">
          {!user && <OrdersEmptyState t={t} type="signed-out" />}

          {user && ordersQuery.isLoading && (
            <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
              Loading orders...
            </p>
          )}

          {user &&
            !ordersQuery.isLoading &&
            orders.map((order, index) => (
              <OrderSummaryCard
                key={order.id}
                t={t}
                reduced={reduced}
                order={order}
                index={index}
              />
            ))}

          {user && !ordersQuery.isLoading && orders.length === 0 && (
            <OrdersEmptyState t={t} type="empty" />
          )}
        </div>
      </div>
    </div>
  );
}
