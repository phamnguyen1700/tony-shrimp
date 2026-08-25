import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { Translations } from "@/i18n";
import { formatOrderDate, formatOrderMoney, getOrderStatusLabel } from "@/lib/order/format";
import type { OrderSummary } from "@/types/order";

interface Props {
  t: Translations;
  order: OrderSummary;
  index: number;
}

export default function OrderPushCard({ t, order, index }: Props) {
  return (
    <article className="ui-radius border border-border bg-card p-2.5 transition-colors hover:border-accent/40">
      <div className="flex flex-col gap-2">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <span className="font-mono-label text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              #{String(index + 1).padStart(2, "0")}
            </span>
            <Badge variant={order.status} className="px-1.5 py-0 text-[10px]">
              {getOrderStatusLabel(order.status, t)}
            </Badge>
            <span className="font-mono-label text-[9px] tracking-widest text-muted-foreground">
              {formatOrderDate(order.created_at)}
            </span>
          </div>
          <Link
            href={`/admin/orders/${order.id}`}
            className="font-display text-base font-semibold italic text-foreground transition-colors hover:text-accent"
          >
            {order.order_number}
          </Link>
          {order.customer_note && (
            <p className="mt-1 line-clamp-1 font-body text-[11px] text-muted-foreground">
              Customer note: {order.customer_note}
            </p>
          )}
        </div>

        <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-2 text-left">
          <div>
            <p className="font-mono-label text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              Total
            </p>
            <p className="mt-0.5 font-display text-sm font-semibold text-foreground">
              {formatOrderMoney(order.total_amount)}
            </p>
          </div>
          <div>
            <p className="font-mono-label text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              Payment
            </p>
            <p className="mt-0.5 truncate font-mono-label text-[11px] text-foreground">
              {order.payment_status}
            </p>
          </div>
          <div>
            <Link
              href={`/admin/orders/${order.id}`}
              className="inline-flex h-7 items-center justify-center bg-accent px-2.5 font-mono-label text-[10px] uppercase tracking-widest text-accent-foreground transition-colors hover:bg-accent/90"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
