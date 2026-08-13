import { motion } from "motion/react";
import Badge from "@/components/ui/Badge";
import type { Translations } from "@/i18n";
import { getPaymentStatusLabel, isPaidOrder } from "@/lib/orderPayment";
import { formatOrderDateTime, getOrderStatusLabel } from "@/lib/orderFormat";
import { useAppRuntime } from "@/providers/AppProviders";
import type { OrderDetail, OrderStatus } from "@/types/order";

interface OrderTimelineProps {
  t: Translations;
  order: OrderDetail;
  reduced: boolean | null;
}

const statusSteps: OrderStatus[] = ["processing", "shipped", "delivered"];

function getTimelineMessage(order: OrderDetail, step: OrderStatus, fallback: string | null) {
  if (step !== "processing") return fallback;
  return order.customer_note ? `Customer note: ${order.customer_note}` : "Customer note: -";
}

export default function OrderTimeline({ t, order, reduced }: OrderTimelineProps) {
  const { lang } = useAppRuntime();
  const statusIndex = statusSteps.indexOf(order.status);
  const isCancelled = order.status === "cancelled";
  const historyByStatus = Object.fromEntries(
    order.status_events.map((event) => [event.status, event]),
  );

  function stepState(stepStatus: OrderStatus): "completed" | "active" | "future" {
    const stepIdx = statusSteps.indexOf(stepStatus);
    if (isCancelled) return "future";
    if (stepIdx < statusIndex) return "completed";
    if (stepIdx === statusIndex) return "active";
    return "future";
  }

  return (
    <div className="mb-10">
      <div className="relative pl-8">
        {isCancelled ? (
          <motion.div
            initial={reduced ? false : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 py-4"
          >
            <div className="absolute left-0 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 bg-red-500/20">
              <span className="h-2 w-2 rounded-full bg-red-500" />
            </div>
            <p className="font-mono-label text-xs uppercase tracking-[0.16em] text-red-500">
              {t.order.cancelled}
            </p>
          </motion.div>
        ) : (
          <div className="absolute bottom-5 left-[9px] top-5 w-px bg-border" />
        )}

        {!isCancelled &&
          statusSteps.map((step, index) => {
            const state = stepState(step);
            const historyEntry = historyByStatus[step];
            const timelineMessage = getTimelineMessage(order, step, historyEntry?.message ?? null);

            return (
              <motion.div
                key={step}
                className="relative flex gap-4 pb-8 last:pb-0"
                initial={reduced ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.35,
                  delay: reduced ? 0 : index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div
                  className={`absolute -left-8 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                    state !== "future" ? "border-accent bg-accent" : "border-border bg-background"
                  }`}
                >
                  {state === "completed" && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path
                        d="M1 3L3 5L7 1"
                        stroke="var(--accent-foreground)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {state === "active" && (
                    <span className="h-2 w-2 rounded-full bg-accent-foreground" />
                  )}
                </div>

                <div className="flex-1 pt-0.5">
                  <div className="flex items-start justify-between gap-4">
                    <p
                      className={`font-mono-label text-xs uppercase tracking-[0.16em] ${
                        state !== "future" ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {getOrderStatusLabel(step, t)}
                    </p>
                    {step === "processing" && <PaymentInlineStatus order={order} lang={lang} />}
                  </div>
                  {historyEntry && (
                    <>
                      <p className="mt-1 font-mono-label text-[11px] tracking-widest text-muted-foreground">
                        {formatOrderDateTime(historyEntry.created_at)}
                      </p>
                      {timelineMessage && (
                        <p className="mt-1 font-body text-sm text-muted-foreground">
                          {timelineMessage}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}

function PaymentInlineStatus({ order, lang }: { order: OrderDetail; lang: "en" | "vi" }) {
  const paymentStatus = String(order.payment_status).toLowerCase();
  const label = getPaymentStatusLabel(order, lang);

  if (isPaidOrder(order)) {
    return (
      <Badge variant="accent">
        {label}
      </Badge>
    );
  }

  if (paymentStatus === "pending") {
    return (
      <Badge variant="cancelled" className="text-red-500">
        {label}
      </Badge>
    );
  }

  return (
    <Badge variant="cancelled" className="text-red-500">
      {paymentStatus}
    </Badge>
  );
}
