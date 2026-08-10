"use client";

import { useState } from "react";
import type { OrderStatus } from "@/types/order";
import { useMarkOwnerNotificationRead, useOwnerNotifications } from "@/hooks/notification";
import { useOwnerOrders } from "@/hooks/order";
import { useAppRuntime } from "@/providers/AppProviders";
import Input from "@/components/ui/Input";
import AdminOrderTable from "./components/AdminOrderTable";
import OrderNotificationsFeed from "./components/OrderNotificationsFeed";
import OrderStatusTabs from "./components/OrderStatusTabs";

export default function AdminOrdersFeature() {
  const { t } = useAppRuntime();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const notificationsQuery = useOwnerNotifications({ unread_only: true, limit: 8, offset: 0 });
  const markNotificationReadMutation = useMarkOwnerNotificationRead();
  const ordersQuery = useOwnerOrders({
    limit: 20,
    offset: 0,
    ...(status ? { status } : {}),
    ...(search.trim() ? { search: search.trim() } : {}),
  });

  return (
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

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <section>
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Order Check
              </p>
              <p className="mt-1 font-body text-sm text-muted-foreground">
                Compact list for spotting missed orders.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <OrderStatusTabs t={t} activeStatus={status} onStatusChange={setStatus} />
          </div>

          <AdminOrderTable orders={ordersQuery.data?.items ?? []} isLoading={ordersQuery.isLoading} />
        </section>

        <OrderNotificationsFeed
          notifications={notificationsQuery.data?.items ?? []}
          isLoading={notificationsQuery.isLoading}
          onMarkRead={(notificationId) => markNotificationReadMutation.mutate(notificationId)}
        />
      </div>
    </div>
  );
}
