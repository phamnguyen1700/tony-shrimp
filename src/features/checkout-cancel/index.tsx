"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import toast from "react-hot-toast";
import { AlertCircle, ClipboardList, CreditCard, Loader2, PackageCheck, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import MotionButton from "@/components/common/motion/MotionButton";
import { routes } from "@/config/routes";
import { useCancelOrder, useContinuePayment, useOrderByPaymentSession } from "@/hooks/order";
import { clearPendingOrderId } from "@/lib/pendingOrder";
import { useAppRuntime } from "@/providers/AppProviders";
import { useCart } from "@/store/cartStore";
import type { OrderDetail } from "@/types/order";

export default function CheckoutCancelFeature() {
  return (
    <Suspense fallback={<FailedShell title="Checking payment" subtitle="We are loading your order from Stripe." />}>
      <CheckoutCancelContent />
    </Suspense>
  );
}

function CheckoutCancelContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? "";
  const orderQuery = useOrderByPaymentSession(sessionId);
  const order = orderQuery.data;

  if (!sessionId) {
    return (
      <FailedShell
        title="Payment not completed"
        subtitle="No worries. Your cart is still saved, so you can review it and try checkout again."
      >
        <FallbackActions />
      </FailedShell>
    );
  }

  if (orderQuery.isLoading) {
    return (
      <FailedShell title="Checking payment" subtitle="We are loading your order from Stripe.">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500">
          <Loader2 className="h-10 w-10 animate-spin" strokeWidth={1.7} />
        </div>
      </FailedShell>
    );
  }

  if (orderQuery.isError || !order) {
    return (
      <FailedShell title="We could not load this order" subtitle="Please open your orders page to check the latest status.">
        <FallbackActions />
      </FailedShell>
    );
  }

  if (order.payment_status === "paid") {
    return (
      <FailedShell title="Payment received" subtitle="Stripe has confirmed this order.">
        <div className="mt-8 border-t border-border pt-6">
          <Link href={`/orders/success?session_id=${encodeURIComponent(sessionId)}`}>
            <MotionButton variant="accent" size="md" className="w-full sm:min-w-52">
              View success
            </MotionButton>
          </Link>
        </div>
      </FailedShell>
    );
  }

  if (order.status === "processing" && order.payment_status === "pending") {
    return (
      <FailedShell
        title="Payment not completed"
        subtitle="Your order is waiting for payment. You can continue payment or cancel this unpaid order."
      >
        <PendingPaymentActions order={order} />
      </FailedShell>
    );
  }

  return (
    <FailedShell title="This order is not active" subtitle="The unpaid order has been cancelled or the payment session expired.">
      <CancelledActions order={order} />
    </FailedShell>
  );
}

function PendingPaymentActions({ order }: { order: OrderDetail }) {
  const router = useRouter();
  const continuePayment = useContinuePayment(order.id);
  const cancelOrder = useCancelOrder(order.id);
  const { addItem, clearCart } = useCart();

  async function payNow() {
    const checkout = await continuePayment.mutateAsync();
    window.location.assign(checkout.checkout_url);
  }

  async function cancelAndRestore() {
    const cancelledOrder = await cancelOrder.mutateAsync();
    restoreCartFromOrder(cancelledOrder, addItem, clearCart);
    clearPendingOrderId(cancelledOrder.id);
    toast.success("Cart restored.");
    router.push("/cart");
  }

  return (
    <>
      <h2 className="mt-6 font-display text-2xl font-semibold text-foreground">Your order is waiting for payment</h2>
      <p className="mx-auto mt-3 max-w-md font-body text-sm leading-6 text-muted-foreground">
        Continue payment with the same order, or cancel it and restore your cart.
      </p>
      <div className="mt-8 border-t border-border pt-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href={`/orders/${order.id}`} className="w-full">
            <MotionButton variant="secondary" size="md" className="w-full">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              View order
            </MotionButton>
          </Link>
          <MotionButton
            variant="accent"
            size="md"
            onClick={() => void payNow()}
            disabled={continuePayment.isPending}
            className="w-full"
          >
            <CreditCard className="h-4 w-4" aria-hidden="true" />
            Continue payment
          </MotionButton>
        </div>
        <button
          type="button"
          onClick={() => void cancelAndRestore()}
          disabled={cancelOrder.isPending || continuePayment.isPending}
          className="mt-5 font-mono-label text-[11px] uppercase tracking-[0.16em] text-red-500 transition-colors hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Cancel order and restore cart
        </button>
      </div>
    </>
  );
}

function CancelledActions({ order }: { order: OrderDetail }) {
  const router = useRouter();
  const { addItem, clearCart } = useCart();

  function restoreCart() {
    restoreCartFromOrder(order, addItem, clearCart);
    toast.success("Cart restored.");
    router.push("/cart");
  }

  return (
    <>
      <h2 className="mt-6 font-display text-2xl font-semibold text-foreground">Checkout was not completed</h2>
      <p className="mx-auto mt-3 max-w-md font-body text-sm leading-6 text-muted-foreground">
        You have not been charged. You can restore the order items to your cart.
      </p>
      <div className="mt-8 border-t border-border pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <MotionButton variant="accent" size="md" onClick={restoreCart} className="w-full sm:min-w-56">
            Restore cart
          </MotionButton>
          <Link href="/orders">
            <MotionButton variant="secondary" size="md" className="w-full sm:min-w-44">
              My orders
            </MotionButton>
          </Link>
        </div>
      </div>
    </>
  );
}

function FallbackActions() {
  const { t } = useAppRuntime();

  return (
    <>
      <h2 className="mt-6 font-display text-2xl font-semibold text-foreground">Checkout was not completed</h2>
      <p className="mx-auto mt-3 max-w-md font-body text-sm leading-6 text-muted-foreground">
        You have not been charged. Continue with your cart when you are ready.
      </p>
      <div className="mt-8 border-t border-border pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/cart">
            <MotionButton variant="accent" size="md" className="w-full sm:min-w-56">
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              Continue with your cart
            </MotionButton>
          </Link>
          <Link href={routes.shop}>
            <MotionButton variant="secondary" size="md" className="w-full sm:min-w-44">
              {t.nav.shop}
            </MotionButton>
          </Link>
        </div>
      </div>
    </>
  );
}

function restoreCartFromOrder(
  order: OrderDetail,
  addItem: ReturnType<typeof useCart>["addItem"],
  clearCart: ReturnType<typeof useCart>["clearCart"],
) {
  clearCart();
  order.items.forEach((item) => {
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
}

function FailedShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <div className="app-page overflow-hidden">
      <div className="app-container relative max-w-5xl py-14 text-center md:py-20">
        <ResultHero title={title} subtitle={subtitle} />
        <div className="mx-auto mt-8 max-w-2xl border border-border bg-card p-8 shadow-2xl shadow-black/10" style={{ borderRadius: "var(--radius)" }}>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <AlertCircle className="h-11 w-11" strokeWidth={1.7} />
          </div>
          {children}
        </div>
        <ResultBenefits />
      </div>
    </div>
  );
}

function ResultHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <p className="mono-eyebrow text-accent">TONY SHRIMP AUSTRALIA</p>
      <h1 className="mt-5 font-display text-5xl font-semibold italic leading-none text-foreground md:text-7xl">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl font-body text-base leading-7 text-muted-foreground md:text-lg">
        {subtitle}
      </p>
    </div>
  );
}

function ResultBenefits() {
  const items = [
    { icon: PackageCheck, title: "Carefully packed", text: "Every order is packed with care." },
    { icon: Truck, title: "Fast & reliable", text: "We ship quickly and safely." },
    { icon: ShieldCheck, title: "Live arrival guarantee", text: "Your shrimp arrive healthy or we help." },
  ];

  return (
    <div className="mx-auto mt-10 grid max-w-3xl gap-4 text-left md:grid-cols-3">
      {items.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex gap-3 md:border-l md:border-border md:pl-6 first:md:border-l-0">
          <Icon className="mt-0.5 h-6 w-6 shrink-0 text-accent" strokeWidth={1.7} />
          <div>
            <p className="font-body text-sm font-semibold text-foreground">{title}</p>
            <p className="mt-1 font-body text-sm leading-5 text-muted-foreground">{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
