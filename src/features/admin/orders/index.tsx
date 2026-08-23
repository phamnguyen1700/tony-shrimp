"use client";

import { useState } from "react";
import type { OrderStatus } from "@/types/order";
import { useOwnerOrders } from "@/hooks/order";
import { useAppRuntime } from "@/providers/AppProviders";
import Input from "@/components/ui/Input";
import AdminNotificationsPanel from "@/features/admin/components/notifications/AdminNotificationsPanel";
import AdminOrderTable from "./components/AdminOrderTable";
import OrderStatusTabs from "./components/OrderStatusTabs";

export default function AdminOrdersFeature() {
  const { t } = useAppRuntime();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const ordersQuery = useOwnerOrders({
    limit: 20,
    offset: 0,
    ...(status ? { status } : {}),
    ...(search.trim() ? { search: search.trim() } : {}),
  });

  return (
    <div className="grid min-h-screen items-start xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <div className="w-full p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
            {t.admin.orders}
          </h1>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-[minmax(220px,360px)]">
          <Input
            placeholder="Search by order #..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <section>
          <div className="mb-4">
            <OrderStatusTabs
              t={t}
              activeStatus={status}
              onStatusChange={setStatus}
            />
          </div>

          <AdminOrderTable
            orders={ordersQuery.data?.items ?? []}
            isLoading={ordersQuery.isLoading}
          />
        </section>
      </div>
      <AdminNotificationsPanel />
    </div>
  );
}
