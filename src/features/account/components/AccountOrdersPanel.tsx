import Link from "next/link";
import { motion } from "motion/react";
import type { Translations } from "@/i18n";
import { sampleOrders, type OrderStatus } from "@/data/orders";
import Badge from "@/shared/ui/Badge";

interface AccountOrdersPanelProps {
  t: Translations;
  reduced: boolean | null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStatusBadgeVariant(status: OrderStatus) {
  return status;
}

function getStatusLabel(status: OrderStatus, t: Translations) {
  const map: Record<OrderStatus, string> = {
    processing: t.order.processing,
    shipped: t.order.shipped,
    delivered: t.order.delivered,
    cancelled: t.order.cancelled,
  };
  return map[status];
}

export default function AccountOrdersPanel({ t, reduced }: AccountOrdersPanelProps) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
    >
      {sampleOrders.map((order, index) => (
        <motion.div
          key={order.id}
          className="ui-radius border border-border p-5 transition-colors hover:border-foreground/20"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: reduced ? 0 : index * 0.07 }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-display text-base font-semibold italic text-foreground">
                  {order.number}
                </p>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {getStatusLabel(order.status, t)}
                </Badge>
              </div>
              <p className="mono-meta mt-1 uppercase">{formatDate(order.date)}</p>
              <p className="mt-2 font-body text-sm text-muted-foreground">
                {order.items
                  .map((item) => `${item.name}${item.grade ? ` (${item.grade})` : ""} x${item.quantity}`)
                  .join(", ")}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-display text-lg font-semibold text-foreground">A${order.total}</p>
              <Link
                href={`/orders/${order.id}`}
                className="mt-2 inline-block font-mono-label text-[11px] uppercase tracking-[0.16em] text-accent transition-colors hover:text-accent/80"
              >
                {t.order.viewOrder}
              </Link>
            </div>
          </div>
        </motion.div>
      ))}

      {sampleOrders.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
            No orders yet.
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-block font-mono-label text-xs uppercase tracking-widest text-accent underline underline-offset-2"
          >
            Browse the shop &rarr;
          </Link>
        </div>
      )}
    </motion.div>
  );
}
