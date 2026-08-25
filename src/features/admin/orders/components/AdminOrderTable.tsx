import Link from "next/link";
import AdminDataTable, {
  type AdminDataTableColumn,
} from "@/components/common/table/AdminDataTable";
import { formatOrderDate, formatOrderMoney } from "@/lib/order/format";
import type { OrderSummary } from "@/types/order";

interface AdminOrderTableProps {
  orders: OrderSummary[];
  isLoading: boolean;
}

export default function AdminOrderTable({ orders, isLoading }: AdminOrderTableProps) {
  const columns: AdminDataTableColumn<OrderSummary>[] = [
    {
      key: "number",
      header: "Order",
      className: "font-mono-label text-xs text-foreground",
      render: (order) => order.order_number,
    },
    {
      key: "total",
      header: "Total",
      align: "center",
      render: (order) => (
        <span className="text-sm text-foreground">{formatOrderMoney(order.total_amount)}</span>
      ),
    },
    {
      key: "payment",
      header: "Payment",
      align: "center",
      className: "font-mono-label text-xs text-muted-foreground",
      render: (order) => order.payment_status,
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
    <AdminDataTable
      rows={orders}
      columns={columns}
      getRowKey={(order) => order.id}
      emptyText="No orders found."
      loadingText="Loading orders..."
      isLoading={isLoading}
      pageSize={10}
      minWidth="760px"
    />
  );
}
