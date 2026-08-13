import Link from "next/link";
import { motion } from "motion/react";
import type { Translations } from "@/i18n";
import type { OrderDetail } from "@/types/order";

interface OrderTrackingHeaderProps {
  t: Translations;
  order: OrderDetail;
  reduced: boolean | null;
}

export default function OrderTrackingHeader({ t, order, reduced }: OrderTrackingHeaderProps) {
  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex flex-wrap items-center gap-2 font-mono-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
      >
        <Link href="/shop" className="transition-colors hover:text-foreground">
          {t.nav.shop}
        </Link>
        <span>•</span>
        <Link href="/orders" className="transition-colors hover:text-foreground">
          {t.nav.myOrders}
        </Link>
        <span>•</span>
        <span className="text-foreground">{order.order_number}</span>
      </nav>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 md:mb-12"
      >
        <p className="mb-2 font-mono-label text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {t.order.orderNumber}
        </p>
        <h1 className="font-display text-5xl font-semibold italic leading-none text-foreground md:text-7xl">
          {order.order_number}
        </h1>
      </motion.div>
    </>
  );
}
