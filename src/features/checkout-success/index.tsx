"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ClipboardList, PackageCheck, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import MotionButton from "@/components/common/motion/MotionButton";
import { clearPendingOrderId } from "@/lib/pendingOrder";
import { useAppRuntime } from "@/providers/AppProviders";
import { useCart } from "@/store/cartStore";

export default function CheckoutSuccessFeature() {
  const { t } = useAppRuntime();
  const { clearCart } = useCart();

  useEffect(() => {
    clearPendingOrderId();
    clearCart();
  }, [clearCart]);

  return (
    <div className="app-page overflow-hidden">
      <div className="app-container relative max-w-5xl py-14 text-center md:py-20">
        <ResultHero title="Payment received" subtitle="Thank you. Your order is confirmed and payment has been received." />
        <div className="mx-auto mt-8 max-w-2xl border border-border bg-card p-8 shadow-2xl shadow-black/10" style={{ borderRadius: "var(--radius)" }}>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/12 text-accent">
            <CheckCircle2 className="h-11 w-11" strokeWidth={1.7} />
          </div>
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
              <Link href="/shop">
                <MotionButton variant="secondary" size="md" className="w-full sm:min-w-52">
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  Continue shopping
                </MotionButton>
              </Link>
            </div>
          </div>
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
