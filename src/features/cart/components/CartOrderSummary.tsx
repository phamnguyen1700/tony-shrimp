import { motion } from "motion/react";
import type { Translations } from "@/i18n";
import MotionButton from "@/components/common/motion/MotionButton";

interface CartOrderSummaryProps {
  t: Translations;
  subtotal: number;
  shipping: number;
  total: number;
  reduced: boolean | null;
  onCheckout: () => void;
}

export default function CartOrderSummary({
  t,
  subtotal,
  shipping,
  total,
  reduced,
  onCheckout,
}: CartOrderSummaryProps) {
  return (
    <motion.div
      className="w-full lg:sticky lg:top-24 lg:w-80"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="ui-radius space-y-4 border border-border p-6">
        <p className="font-mono-label text-xs uppercase tracking-[0.16em] text-foreground">
          ORDER SUMMARY
        </p>
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <p className="font-body text-sm text-muted-foreground">{t.cart.subtotal}</p>
            <p className="font-display text-sm font-medium text-foreground">A${subtotal}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-body text-sm text-muted-foreground">{t.cart.shipping}</p>
            <p className="font-display text-sm font-medium text-foreground">A${shipping}</p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="font-mono-label text-xs uppercase tracking-[0.16em] text-foreground">
            {t.cart.total}
          </p>
          <p className="font-display text-xl font-semibold text-foreground">A${total}</p>
        </div>
        <MotionButton variant="accent" size="lg" className="mt-2 w-full" onClick={onCheckout}>
          {t.cart.checkout}
        </MotionButton>
      </div>
    </motion.div>
  );
}
