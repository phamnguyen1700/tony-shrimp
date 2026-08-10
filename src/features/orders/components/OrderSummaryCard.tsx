import Link from "next/link";
import { motion } from "motion/react";
import type { Translations } from "@/i18n";
import { formatOrderDate, formatOrderMoney, getOrderStatusLabel } from "@/lib/orderFormat";
import Badge from "@/components/ui/Badge";
import type { OrderSummary } from "@/types/order";

interface OrderSummaryCardProps {
  t: Translations;
  reduced: boolean | null;
  order: OrderSummary;
  index: number;
}

export default function OrderSummaryCard({ t, reduced, order, index }: OrderSummaryCardProps) {
  return (
    <motion.div
      className="ui-radius border border-border p-5 transition-colors hover:border-foreground/20"
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: reduced ? 0 : index * 0.07 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-display text-base font-semibold italic text-foreground">
              {order.order_number}
            </p>
            <Badge variant={order.status}>{getOrderStatusLabel(order.status, t)}</Badge>
          </div>
          <p className="mono-meta mt-1 uppercase">{formatOrderDate(order.created_at)}</p>
          {order.tracking_number && (
            <p className="mt-2 font-body text-sm text-muted-foreground">
              {order.carrier ?? "Tracking"}: {order.tracking_number}
            </p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-lg font-semibold text-foreground">
            {formatOrderMoney(order.total_amount)}
          </p>
          <Link
            href={`/orders/${order.id}`}
            className="mt-2 inline-block font-mono-label text-[11px] uppercase tracking-[0.16em] text-accent transition-colors hover:text-accent/80"
          >
            {t.order.viewOrder}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
