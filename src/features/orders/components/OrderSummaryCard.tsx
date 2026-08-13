import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import MotionButton from "@/components/common/motion/MotionButton";
import type { Translations } from "@/i18n";
import { useCancelOrder, useContinuePayment } from "@/hooks/order";
import { clearPendingOrderId } from "@/lib/pendingOrder";
import { formatOrderDate, formatOrderMoney, getOrderStatusLabel } from "@/lib/orderFormat";
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
  const { addItem, clearCart } = useCart();
  const continuePayment = useContinuePayment(order.id);
  const cancelOrder = useCancelOrder(order.id);
  const isPendingPayment = order.status === "processing" && order.payment_status === "pending";

  async function payNow() {
    const checkout = await continuePayment.mutateAsync();
    window.location.assign(checkout.checkout_url);
  }

  async function cancelAndRestore() {
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
    toast.success("Cart restored.");
    router.push("/cart");
  }

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
          {isPendingPayment ? (
            <p className="mt-2 font-body text-sm text-amber-600">
              You have not completed payment yet / Ban chua hoan tat thanh toan
            </p>
          ) : (
            <p className="mt-2 font-body text-sm text-muted-foreground">
              Payment: {order.payment_status}
            </p>
          )}
          {isPendingPayment && (
            <div className="mt-4 flex flex-wrap gap-3">
              <MotionButton
                variant="accent"
                size="sm"
                onClick={() => void payNow()}
                disabled={continuePayment.isPending}
              >
                Pay now / Thanh toan
              </MotionButton>
              <MotionButton
                variant="ghost"
                size="sm"
                onClick={() => void cancelAndRestore()}
                disabled={cancelOrder.isPending || continuePayment.isPending}
              >
                Cancel & restore cart
              </MotionButton>
            </div>
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
