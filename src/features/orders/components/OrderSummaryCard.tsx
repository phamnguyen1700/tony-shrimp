import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import type { KeyboardEvent, SyntheticEvent } from "react";
import toast from "react-hot-toast";
import MotionButton from "@/components/common/motion/MotionButton";
import type { Translations } from "@/i18n";
import { useCancelOrder, useContinuePayment } from "@/hooks/order";
import {
  getPaymentStatusLabel,
  getPendingPaymentCopy,
  isPaidOrder,
  isPendingPaymentOrder,
} from "@/lib/orderPayment";
import { clearPendingOrderId } from "@/lib/pendingOrder";
import { formatOrderDate, formatOrderMoney, getOrderStatusLabel } from "@/lib/orderFormat";
import { useAppRuntime } from "@/providers/AppProviders";
import { useCart } from "@/store/cartStore";
import Badge from "@/components/ui/Badge";
import type { OrderSummary } from "@/types/order";

interface OrderSummaryCardProps {
  t: Translations;
  reduced: boolean | null;
  order: OrderSummary;
  index: number;
}

export default function OrderSummaryCard({ t, reduced, order, index }: OrderSummaryCardProps) {
  const router = useRouter();
  const { lang } = useAppRuntime();
  const { addItem, clearCart } = useCart();
  const continuePayment = useContinuePayment(order.id);
  const cancelOrder = useCancelOrder(order.id);
  const isPendingPayment = isPendingPaymentOrder(order);
  const copy = getPendingPaymentCopy(lang);
  const paymentLabel = getPaymentStatusLabel(order, lang);
  const detailHref = `/orders/${order.id}`;
  const rowTone = index % 2 === 0 ? "bg-card" : "bg-secondary/30";

  function openDetail() {
    router.push(detailHref);
  }

  function stopCardOpen(event: SyntheticEvent) {
    event.stopPropagation();
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDetail();
    }
  }

  async function payNow(event?: SyntheticEvent) {
    event?.stopPropagation();
    const checkout = await continuePayment.mutateAsync();
    window.location.assign(checkout.checkout_url);
  }

  async function cancelAndRestore(event?: SyntheticEvent) {
    event?.stopPropagation();
    const cancelledOrder = await cancelOrder.mutateAsync();
    clearPendingOrderId(cancelledOrder.id);
    clearCart();
    cancelledOrder.items.forEach((item) => {
      addItem(
        {
          productId: item.shrimp_id,
          variantId: item.variant_id,
          name: item.shrimp_name,
          variantName: item.variant_name,
          imageUrl: item.image_url ?? undefined,
          price: Number(item.unit_price),
          saleUnit: item.sale_unit,
          saleQuantity: item.sale_quantity,
        },
        item.quantity,
      );
    });
    toast.success(copy.restored);
    router.push("/cart");
  }

  return (
    <motion.div
      role="link"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={handleCardKeyDown}
      className={`ui-radius cursor-pointer border border-border p-5 transition-colors hover:border-accent/30 hover:bg-accent/5 ${rowTone}`}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: reduced ? 0 : index * 0.07 }}
    >
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 flex-1">
          <div>
            <p className="font-display text-lg font-semibold italic text-foreground">
              {order.order_number}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              <Badge variant={order.status}>{getOrderStatusLabel(order.status, t)}</Badge>
              <Badge
                variant={isPaidOrder(order) ? "accent" : "cancelled"}
                className={isPaidOrder(order) ? "" : "text-red-500"}
              >
                {paymentLabel}
              </Badge>
              <span className="font-mono-label text-[11px] tracking-widest text-muted-foreground">
                {formatOrderDate(order.created_at)}
              </span>
            </div>
          </div>
          {isPendingPayment ? (
            <p className="mt-2 font-body text-sm text-red-500">
              {copy.message}
            </p>
          ) : (
            <div className="mt-2 h-5" />
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end text-right">
          <p className="font-display text-lg font-semibold text-foreground">
            {formatOrderMoney(order.total_amount)}
          </p>
          <Link
            href={detailHref}
            onClick={stopCardOpen}
            className="mt-2 inline-block font-mono-label text-[11px] uppercase tracking-[0.16em] text-accent transition-colors hover:text-accent/80"
          >
            {t.order.viewOrder}
          </Link>
          {isPendingPayment && (
            <div className="mt-5 grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <MotionButton
                variant="ghost"
                size="sm"
                onClick={(event) => void cancelAndRestore(event)}
                disabled={cancelOrder.isPending || continuePayment.isPending}
                className="justify-self-end whitespace-nowrap px-2 text-[10px] tracking-[0.12em] text-red-500 hover:bg-red-500/10 hover:text-red-500"
              >
                {copy.cancel}
              </MotionButton>
              <MotionButton
                variant="accent"
                size="sm"
                onClick={(event) => void payNow(event)}
                disabled={continuePayment.isPending}
                className="whitespace-nowrap"
              >
                {copy.pay}
              </MotionButton>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
