import { motion } from "motion/react";
import type { Translations } from "@/i18n";
import { getPaymentStatusLabel, isPendingPaymentOrder } from "@/lib/orderPayment";
import { formatOrderDate } from "@/lib/orderFormat";
import { useAppRuntime } from "@/providers/AppProviders";
import type { OrderDetail } from "@/types/order";

interface OrderTrackingCardProps {
  t: Translations;
  order: OrderDetail;
  reduced: boolean | null;
}

export default function OrderTrackingCard({ order, reduced }: OrderTrackingCardProps) {
  const { lang } = useAppRuntime();
  const paymentDate = order.paid_at ?? order.payment_failed_at ?? null;
  const isPendingPayment = isPendingPaymentOrder(order);
  const paymentLabel = getPaymentStatusLabel(order, lang);

  if (isPendingPayment) return null;

  return (
    <motion.div
      className="mb-8"
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.3 }}
    >
      <div className="ui-radius space-y-3 border border-border p-5">
          <p className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            PAYMENT
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground">
                Provider
              </p>
              <p className="mt-0.5 font-body text-sm text-foreground">
                {(order.payment_provider ?? "stripe").toUpperCase()}
              </p>
            </div>
            <div>
              <p className="font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground">
                Status
              </p>
              <p className="mt-0.5 font-mono-label text-xs uppercase text-foreground">
                {paymentLabel}
              </p>
            </div>
            {paymentDate && (
              <div>
                <p className="font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground">
                  Updated
                </p>
                <p className="mt-0.5 font-body text-sm text-foreground">
                  {formatOrderDate(paymentDate)}
                </p>
              </div>
            )}
          </div>
      </div>
    </motion.div>
  );
}
