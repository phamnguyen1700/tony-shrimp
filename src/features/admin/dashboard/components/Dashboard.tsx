import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import AdminDataTable, { type AdminDataTableColumn } from "@/components/common/table/AdminDataTable";
import type { Translations } from "@/i18n";
import { shrimpProducts } from "@/data/shrimp";
import Badge from "@/components/ui/Badge";
import { fadeUp, staggerFast } from "@/lib/motionVariants";
import { formatOrderDate, formatOrderMoney, getOrderStatusLabel } from "@/lib/orderFormat";
import type { OrderSummary } from "@/types/order";

interface Props {
  t: Translations;
  orders: OrderSummary[];
  isOrdersLoading: boolean;
}

const statCards = (t: Translations, orders: OrderSummary[]) => [
  {
    label: t.admin.processingOrders,
    value: orders.filter((order) => order.status === "processing").length,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: t.admin.shippedOrders,
    value: orders.filter((order) => order.status === "shipped").length,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
  {
    label: t.admin.availableProducts,
    value: shrimpProducts.filter((shrimp) => shrimp.status !== "out-of-stock").length,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    label: t.admin.lowAvailability,
    value: shrimpProducts.filter((shrimp) => shrimp.status === "low-stock").length,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
];

export default function Dashboard({ t, orders, isOrdersLoading }: Props) {
  const reduced = useReducedMotion();
  const recentOrders = orders.slice(0, 5);

  const columns: AdminDataTableColumn<OrderSummary>[] = [
    {
      key: "number",
      header: "Order #",
      className: "font-mono-label text-xs text-foreground",
      render: (order) => order.order_number,
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (order) => <Badge variant={order.status}>{getOrderStatusLabel(order.status, t)}</Badge>,
    },
    {
      key: "total",
      header: "Total",
      align: "center",
      render: (order) => <span className="text-sm text-foreground">{formatOrderMoney(order.total_amount)}</span>,
    },
    {
      key: "date",
      header: "Date",
      align: "center",
      className: "font-mono-label text-xs text-muted-foreground",
      render: (order) => formatOrderDate(order.created_at),
    },
    {
      key: "action",
      header: "",
      align: "center",
      render: (order) => (
        <Link
          href={`/admin/orders/${order.id}`}
          className="font-mono-label text-xs uppercase tracking-widest text-accent hover:underline"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="max-w-6xl p-6 md:p-8">
      <h1 className="mb-8 font-display text-2xl font-semibold text-foreground md:text-3xl">
        {t.admin.dashboard}
      </h1>

      <motion.div
        className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4"
        variants={reduced ? undefined : staggerFast}
        initial={reduced ? undefined : "hidden"}
        animate={reduced ? undefined : "visible"}
      >
        {statCards(t, orders).map((card) => (
          <motion.div
            key={card.label}
            variants={reduced ? undefined : fadeUp}
            className="ui-radius border border-border bg-card p-5"
          >
            <div className="mb-3 flex items-start justify-between">
              <span className="text-muted-foreground">{card.icon}</span>
            </div>
            <div className="mb-1 font-display text-3xl font-semibold text-foreground">{card.value}</div>
            <div className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
              {card.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono-label text-xs uppercase tracking-widest text-foreground">{t.admin.recentOrders}</h2>
        <Link href="/admin/orders" className="font-mono-label text-xs uppercase tracking-widest text-accent hover:underline">
          View all -&gt;
        </Link>
      </div>

      <div className="mb-4 hidden md:block">
        <AdminDataTable
          rows={recentOrders}
          columns={columns}
          getRowKey={(order) => order.id}
          emptyText="No recent orders."
          loadingText="Loading orders..."
          isLoading={isOrdersLoading}
          pageSize={10}
          minWidth="760px"
        />
      </div>

      <div className="space-y-3 md:hidden">
        {recentOrders.map((order) => (
          <div key={order.id} className="ui-radius border border-border bg-card p-4">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <div className="font-mono-label text-xs text-foreground">{order.order_number}</div>
                <div className="mt-0.5 text-sm text-muted-foreground">{formatOrderDate(order.created_at)}</div>
              </div>
              <Badge variant={order.status}>{getOrderStatusLabel(order.status, t)}</Badge>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
                {formatOrderMoney(order.total_amount)}
              </div>
              <Link
                href={`/admin/orders/${order.id}`}
                className="font-mono-label text-xs uppercase tracking-widest text-accent hover:underline"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
