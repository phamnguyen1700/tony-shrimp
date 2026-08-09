import { motion } from "motion/react";
import AppBreadcrumb from "@/components/common/navigation/AppBreadcrumb";
import type { Translations } from "@/i18n";
import type { CartItem } from "@/types/cart";
import CartEmptyState from "./CartEmptyState";
import CartItemsList from "./CartItemsList";
import CartOrderSummary from "./CartOrderSummary";

interface CartScreenProps {
  t: Translations;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  reduced: boolean | null;
  returnProduct: { href: string; name: string } | null;
  onCheckout: () => void;
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export default function CartScreen({
  t,
  items,
  subtotal,
  shipping,
  total,
  reduced,
  returnProduct,
  onCheckout,
  onRemoveItem,
  onUpdateQuantity,
}: CartScreenProps) {
  return (
    <div className="app-page">
      <div className="app-container">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 md:mb-12"
        >
          <AppBreadcrumb
            className="mb-4"
            items={[
              { label: t.nav.shop, href: "/shop" },
              ...(returnProduct ? [{ label: returnProduct.name, href: returnProduct.href }] : []),
              { label: t.cart.title },
            ]}
          />
          <h1 className="font-display text-5xl font-semibold italic leading-none text-foreground md:text-7xl">
            {t.cart.title}
          </h1>
        </motion.div>

        {items.length === 0 ? (
          <CartEmptyState t={t} reduced={reduced} returnProduct={returnProduct} />
        ) : (
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-12">
            <CartItemsList
              t={t}
              items={items}
              reduced={reduced}
              returnProduct={returnProduct}
              onRemoveItem={onRemoveItem}
              onUpdateQuantity={onUpdateQuantity}
            />
            <CartOrderSummary
              t={t}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              reduced={reduced}
              onCheckout={onCheckout}
            />
          </div>
        )}
      </div>
    </div>
  );
}
