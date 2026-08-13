import { motion } from "motion/react";
import { isVideoMediaUrl } from "@/lib/media";
import { formatOrderMoney } from "@/lib/orderFormat";
import type { OrderDetail } from "@/types/order";

interface OrderItemsListProps {
  order: OrderDetail;
  reduced: boolean | null;
}

export default function OrderItemsList({ order, reduced }: OrderItemsListProps) {
  return (
    <motion.div
      className="space-y-4"
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.35 }}
    >
      <p className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        ITEMS
      </p>
      {order.items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 border-b border-border py-3">
          <div className="ui-radius h-14 w-14 shrink-0 bg-[#080b08]">
            {item.image_url && isVideoMediaUrl(item.image_url) ? (
              <video src={item.image_url} className="h-full w-full object-contain" muted playsInline preload="metadata" />
            ) : item.image_url ? (
              <img src={item.image_url} alt={item.shrimp_name} className="h-full w-full object-contain" />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-semibold italic text-foreground">{item.shrimp_name}</p>
            <p className="font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground">
              {item.variant_name}
            </p>
          </div>
          <p className="font-mono-label text-xs tracking-widest text-muted-foreground">x{item.quantity}</p>
          <p className="font-display text-sm font-medium text-foreground">
            {formatOrderMoney(item.line_total)}
          </p>
        </div>
      ))}
    </motion.div>
  );
}
