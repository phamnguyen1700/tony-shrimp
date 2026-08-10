import Link from "next/link";
import { motion } from "motion/react";
import Badge from "@/components/ui/Badge";
import type { Translations } from "@/i18n";
import { formatOrderDate, getOrderStatusLabel } from "@/lib/orderFormat";
import type { OrderDetail } from "@/types/order";

interface AdminOrderHeaderProps {
  t: Translations;
  order: OrderDetail;
  reduced: boolean | null;
}

export default function AdminOrderHeader({ t, order, reduced }: AdminOrderHeaderProps) {
  return (
    <>
      <Link
        href="/admin/orders"
        className="mb-6 inline-flex items-center gap-1.5 font-mono-label text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
      >
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Orders
      </Link>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-7 md:mb-9"
      >
        <p className="mb-2 font-mono-label text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {t.order.orderNumber}
        </p>
        <h1 className="font-display text-4xl font-semibold italic leading-none text-foreground md:text-6xl">
          {order.order_number}
        </h1>
        <div className="mt-4 flex items-center gap-3">
          <Badge variant={order.status}>{getOrderStatusLabel(order.status, t)}</Badge>
          <span className="font-mono-label text-[11px] tracking-widest text-muted-foreground">
            {formatOrderDate(order.created_at)}
          </span>
        </div>
      </motion.div>
    </>
  );
}
