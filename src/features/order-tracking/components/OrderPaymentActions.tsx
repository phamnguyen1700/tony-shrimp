import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MotionButton from "@/components/common/motion/MotionButton";
import { useCancelOrder, useContinuePayment } from "@/hooks/order";
import { getPendingPaymentCopy, isPendingPaymentOrder } from "@/lib/payment/orderPayment";
import { clearPendingOrderId } from "@/lib/order/pending";
import { useAppRuntime } from "@/providers/AppProviders";
import { useCart } from "@/store/cartStore";
import type { OrderDetail } from "@/types/order";

interface OrderPaymentActionsProps {
  order: OrderDetail;
}

export default function OrderPaymentActions({ order }: OrderPaymentActionsProps) {
  const router = useRouter();
  const { lang } = useAppRuntime();
  const { addItem, clearCart } = useCart();
  const continuePayment = useContinuePayment(order.id);
  const cancelOrder = useCancelOrder(order.id);
  const isPendingPayment = isPendingPaymentOrder(order);
  const copy = getPendingPaymentCopy(lang);

  if (!isPendingPayment) return null;

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
    toast.success(copy.restored);
    router.push("/cart");
  }

  return (
    <div className="ui-radius space-y-4 border border-red-500/35 bg-red-500/5 p-5">
      <div>
        <p className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-red-500">
          {copy.title}
        </p>
        <p className="mt-2 font-body text-sm leading-6 text-muted-foreground">
          {copy.message}
        </p>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <MotionButton
          variant="ghost"
          size="sm"
          onClick={() => void cancelAndRestore()}
          disabled={cancelOrder.isPending || continuePayment.isPending}
          className="justify-self-start whitespace-nowrap px-2 text-[10px] tracking-[0.12em] text-red-500 hover:bg-red-500/10 hover:text-red-500"
        >
          {copy.cancel}
        </MotionButton>
        <MotionButton
          variant="accent"
          size="sm"
          onClick={() => void payNow()}
          disabled={continuePayment.isPending}
          className="shrink-0 whitespace-nowrap"
        >
          {copy.pay}
        </MotionButton>
      </div>
    </div>
  );
}
