"use client";

import Link from "next/link";
import { useReducedMotion } from "motion/react";
import PageHero from "@/components/common/layout/PageHero";
import MotionButton from "@/components/common/motion/MotionButton";
import { useAppRuntime } from "@/providers/AppProviders";

export default function CheckoutCancelFeature() {
  const { t } = useAppRuntime();
  const reduced = useReducedMotion();

  return (
    <div className="app-page">
      <div className="app-container max-w-3xl">
        <PageHero title="Checkout cancelled" reduced={reduced} className="mb-8" />
        <div className="ui-radius border border-border bg-card p-6">
          <p className="font-body text-sm leading-6 text-muted-foreground">
            Your cart is still saved. You can return to checkout whenever you are ready.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/cart">
              <MotionButton variant="accent" size="sm">{t.nav.cart}</MotionButton>
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
