import { motion } from "motion/react";
import type { Translations } from "@/i18n";
import { formatOrderDate } from "@/lib/orderFormat";
import type { OrderDetail } from "@/types/order";

interface OrderTrackingCardProps {
  t: Translations;
  order: OrderDetail;
  reduced: boolean | null;
}

export default function OrderTrackingCard({ t, order, reduced }: OrderTrackingCardProps) {
  if ((order.status !== "shipped" && order.status !== "delivered") || !order.carrier) {
    return null;
  }

  return (
    <motion.div
      className="ui-radius mb-8 space-y-3 border border-border p-5"
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.3 }}
    >
      <p className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        TRACKING
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground">
            {t.order.carrier}
          </p>
          <p className="mt-0.5 font-body text-sm text-foreground">{order.carrier}</p>
        </div>
        <div>
          <p className="font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground">
            {t.order.trackingNumber}
          </p>
          <p className="mt-0.5 font-mono-label text-xs text-foreground">{order.tracking_number}</p>
        </div>
        {order.shipped_at && (
          <div>
            <p className="font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground">
              {t.order.shippedDate}
            </p>
            <p className="mt-0.5 font-body text-sm text-foreground">{formatOrderDate(order.shipped_at)}</p>
          </div>
        )}
      </div>
      {order.tracking_url && (
        <a
          href={order.tracking_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-mono-label text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:text-accent/80"
        >
          {t.order.trackPackage}
        </a>
      )}
    </motion.div>
  );
}
