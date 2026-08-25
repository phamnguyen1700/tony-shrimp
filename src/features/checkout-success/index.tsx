"use client";

import { useEffect, useState } from "react";
import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ClipboardList, Loader2, PackageCheck, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import MotionButton from "@/components/common/motion/MotionButton";
import { routes } from "@/config/routes";
import { useOrderByPaymentSession } from "@/hooks/order";
import { clearPendingOrderId } from "@/lib/order/pending";
import { useAppRuntime } from "@/providers/AppProviders";
import { useCart } from "@/store/cartStore";

export default function CheckoutSuccessFeature() {
  return (
    <Suspense
      fallback={
        <SuccessShell
          title="Checking payment"
          subtitle="We are loading your order from Stripe."
          icon="loading"
        />
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? "";
  const orderQuery = useOrderByPaymentSession(sessionId);
  const order = orderQuery.data;
  const verificationTimedOut = useVerificationTimeout(sessionId);
  const isPaid = order?.payment_status === "paid";
  const isPending = order?.status === "processing" && order.payment_status === "pending";
  const isFailed = order?.status === "cancelled" || order?.payment_status === "failed";

  useClearCompletedCheckout(isPaid);

  if (!sessionId) {
    return (
      <SuccessShell
        title="We could not verify payment"
        subtitle="Please open your orders page to check the latest status from Tony Shrimp."
        icon="status"
      >
        <VerifyActions />
      </SuccessShell>
    );
  }

  if (orderQuery.isLoading) {
    return (
      <SuccessShell
        title="Checking payment"
        subtitle="We are loading your order from Stripe."
        icon="loading"
      />
    );
  }

  if (orderQuery.isError || !order) {
    return (
      <SuccessShell
        title="We could not load this order"
        subtitle="Please open your orders page to check the latest status."
        icon="status"
      >
        <VerifyActions />
      </SuccessShell>
    );
  }

  if (isPending) {
    return (
      <SuccessShell
        title="Confirming your payment"
        icon="loading"
        subtitle={
          verificationTimedOut
            ? "Confirmation is taking longer than usual. You can refresh the status or open your order."
            : "This usually takes a few seconds. We will update the order as soon as Stripe confirms it."
        }
      >
        <div className="mt-8 border-t border-border pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            {verificationTimedOut && (
              <MotionButton
                variant="accent"
                size="md"
                onClick={() => void orderQuery.refetch()}
                className="w-full sm:min-w-52"
              >
                Refresh status
              </MotionButton>
            )}
            <Link href={`/orders/${order.id}`}>
              <MotionButton variant="secondary" size="md" className="w-full sm:min-w-52">
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
                View order
              </MotionButton>
            </Link>
          </div>
        </div>
      </SuccessShell>
    );
  }

  if (isFailed) {
    return (
      <SuccessShell
        title="Payment was not completed"
        subtitle="Your order is still available to review."
        icon="status"
      >
        <div className="mt-8 border-t border-border pt-6">
          <Link href={`/orders/failed?session_id=${encodeURIComponent(sessionId)}`}>
            <MotionButton variant="secondary" size="md" className="w-full sm:min-w-56">
              Review payment
            </MotionButton>
          </Link>
        </div>
      </SuccessShell>
    );
  }

  if (order.payment_status !== "paid") {
    return (
      <SuccessShell
        title="Payment status unavailable"
        subtitle="Please open your order to check the latest payment state."
        icon="status"
      >
        <div className="mt-8 border-t border-border pt-6">
          <Link href={`/orders/${order.id}`}>
            <MotionButton variant="secondary" size="md" className="w-full sm:min-w-52">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              View order
            </MotionButton>
          </Link>
        </div>
      </SuccessShell>
    );
  }

  return (
    <SuccessShell title="Payment received" subtitle="Thank you. Your order is confirmed and payment has been received.">
      <SuccessActions />
    </SuccessShell>
  );
}

function useClearCompletedCheckout(isPaid: boolean) {
  const { clearCart } = useCart();

  useEffect(() => {
    if (!isPaid) return;
    clearPendingOrderId();
    clearCart();
  }, [clearCart, isPaid]);
}

function useVerificationTimeout(sessionId: string) {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    setTimedOut(false);
    if (!sessionId) return;

    const timer = window.setTimeout(() => setTimedOut(true), 32000);
    return () => window.clearTimeout(timer);
  }, [sessionId]);

  return timedOut;
}

function SuccessShell({
  title,
  subtitle,
  children,
  icon = "success",
}: {
  title: string;
  subtitle: string;
  children?: ReactNode;
  icon?: "success" | "loading" | "status";
}) {
  return (
    <div className="app-page overflow-hidden">
      <div className="app-container relative max-w-5xl py-14 text-center md:py-20">
        <ResultHero title={title} subtitle={subtitle} />
        <div className="mx-auto mt-8 max-w-2xl border border-border bg-card p-8 shadow-2xl shadow-black/10" style={{ borderRadius: "var(--radius)" }}>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/12 text-accent">
            {icon === "loading" ? (
              <Loader2 className="h-10 w-10 animate-spin" strokeWidth={1.7} />
            ) : icon === "status" ? (
              <ClipboardList className="h-10 w-10" strokeWidth={1.7} />
            ) : (
              <CheckCircle2 className="h-11 w-11" strokeWidth={1.7} />
            )}
          </div>
          {children}
        </div>
        <ResultBenefits />
      </div>
    </div>
  );
}

function SuccessActions() {
  const { t } = useAppRuntime();

  return (
    <>
      <h2 className="mt-6 font-display text-2xl font-semibold text-foreground">Your order is paid</h2>
      <p className="mx-auto mt-3 max-w-md font-body text-sm leading-6 text-muted-foreground">
        Tony Shrimp will prepare your order and keep you updated when it ships.
      </p>
      <div className="mt-8 border-t border-border pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/orders">
            <MotionButton variant="accent" size="md" className="w-full sm:min-w-52">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              {t.nav.myOrders}
            </MotionButton>
          </Link>
          <Link href={routes.shop}>
            <MotionButton variant="secondary" size="md" className="w-full sm:min-w-52">
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              Continue shopping
            </MotionButton>
          </Link>
        </div>
      </div>
    </>
  );
}

function VerifyActions() {
  const { t } = useAppRuntime();

  return (
    <>
      <h2 className="mt-6 font-display text-2xl font-semibold text-foreground">Check your order status</h2>
      <p className="mx-auto mt-3 max-w-md font-body text-sm leading-6 text-muted-foreground">
        Payment is only confirmed after Tony Shrimp receives the latest status.
      </p>
      <div className="mt-8 border-t border-border pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/orders">
            <MotionButton variant="accent" size="md" className="w-full sm:min-w-52">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              {t.nav.myOrders}
            </MotionButton>
          </Link>
          <Link href={routes.shop}>
            <MotionButton variant="secondary" size="md" className="w-full sm:min-w-52">
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              Continue shopping
            </MotionButton>
          </Link>
        </div>
      </div>
    </>
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
