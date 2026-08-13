"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import PageHero from "@/components/common/layout/PageHero";
import MotionButton from "@/components/common/motion/MotionButton";
import { useAppRuntime } from "@/providers/AppProviders";
import { useCart } from "@/store/cartStore";

export default function CheckoutSuccessFeature() {
  const { t } = useAppRuntime();
  const reduced = useReducedMotion();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="app-page">
      <div className="app-container max-w-3xl">
        <PageHero title="Payment received" reduced={reduced} className="mb-8" />
        <div className="ui-radius border border-border bg-card p-6">
          <p className="font-body text-sm leading-6 text-muted-foreground">
            Your order is paid. Tony Shrimp will prepare it and update the status when it ships.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/orders">
              <MotionButton variant="accent" size="sm">{t.nav.myOrders}</MotionButton>
            </Link>
            <Link href="/shop">
              <MotionButton variant="ghost" size="sm">{t.nav.shop}</MotionButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
