"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppRuntime } from "@/providers/AppProviders";
import { useAuthStore } from "@/store/authStore";
import { useCart } from "@/store/cartStore";
import CartScreen from "./components/CartScreen";

export default function CartFeature() {
  const { t } = useAppRuntime();
  const router = useRouter();
  const reduced = useReducedMotion();
  const searchParams = useSearchParams();
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const user = useAuthStore((state) => state.user);
  const [lastViewedProduct, setLastViewedProduct] = useState<{ href: string; name: string } | null>(null);

  const fromProductId = searchParams.get("fromProductId");
  const fromProductName = searchParams.get("fromProductName");
  const shouldUseLastViewed = searchParams.get("fromLastViewed") === "1";
  const queryReturnProduct =
    fromProductId && fromProductName
      ? {
          href: `/products/${fromProductId}`,
          name: fromProductName,
        }
      : null;
  const returnProduct = queryReturnProduct ?? lastViewedProduct;
  const shipping = items.length > 0 ? 15 : 0;
  const total = subtotal + shipping;

  function checkout() {
    if (user) return;

    const query = searchParams.toString();
    const redirectTo = `/cart${query ? `?${query}` : ""}`;
    router.push(`/account?redirect=${encodeURIComponent(redirectTo)}`);
  }

  useEffect(() => {
    if (queryReturnProduct || !shouldUseLastViewed) {
      setLastViewedProduct(null);
      return;
    }

    try {
      const value = sessionStorage.getItem("tony-last-viewed-product");
      if (!value) return;
      const parsed = JSON.parse(value) as { href?: string; name?: string };
      if (parsed.href && parsed.name) setLastViewedProduct({ href: parsed.href, name: parsed.name });
    } catch {
      setLastViewedProduct(null);
    }
  }, [queryReturnProduct, shouldUseLastViewed]);

  return (
    <CartScreen
      t={t}
      items={items}
      subtotal={subtotal}
      shipping={shipping}
      total={total}
      reduced={reduced}
      returnProduct={returnProduct}
      onCheckout={checkout}
      onRemoveItem={removeItem}
      onUpdateQuantity={updateQuantity}
    />
  );
}
