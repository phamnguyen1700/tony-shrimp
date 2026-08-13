import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MotionButton from "@/components/common/motion/MotionButton";
import { useCancelOrder, useContinuePayment } from "@/hooks/order";
import { clearPendingOrderId } from "@/lib/pendingOrder";
import { useCart } from "@/store/cartStore";
import type { OrderDetail } from "@/types/order";

interface OrderPaymentActionsProps {
  order: OrderDetail;
}

export default function OrderPaymentActions({ order }: OrderPaymentActionsProps) {
  const router = useRouter();
  const { addItem, clearCart } = useCart();
  const continuePayment = useContinuePayment(order.id);
  const cancelOrder = useCancelOrder(order.id);
  const isPendingPayment = order.status === "processing" && order.payment_status === "pending";

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
    toast.success("Cart restored.");
    router.push("/cart");
  }

  return (
    <div className="ui-radius space-y-4 border border-amber-500/40 bg-amber-500/5 p-5">
      <div>
        <p className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-amber-600">
          Payment pending
        </p>
        <p className="mt-2 font-body text-sm leading-6 text-muted-foreground">
          You have not completed payment yet. Ban chua hoan tat thanh toan.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <MotionButton
          variant="accent"
          size="md"
          onClick={() => void payNow()}
          disabled={continuePayment.isPending}
          className="w-full"
        >
          Pay now / Thanh toan
        </MotionButton>
        <MotionButton
          variant="ghost"
          size="sm"
          onClick={() => void cancelAndRestore()}
          disabled={cancelOrder.isPending || continuePayment.isPending}
          className="w-full"
        >
          Cancel order and restore cart
        </MotionButton>
      </div>
    </div>
  );
}
