"use client";

import { useOwnerOrders } from "@/hooks/order";
import { useAppRuntime } from "@/providers/AppProviders";
import Dashboard from "./components/Dashboard";

export default function AdminDashboardFeature() {
  const { t } = useAppRuntime();
  const ordersQuery = useOwnerOrders({ limit: 5, offset: 0 });

  return (
    <Dashboard
      t={t}
      orders={ordersQuery.data?.items ?? []}
      isOrdersLoading={ordersQuery.isLoading}
    />
  );
}
